import { GoogleAuth } from 'google-auth-library';
import fetch from 'node-fetch'; // wait, is node-fetch or global fetch available in Node 22? Node 22 has native global fetch!

async function run() {
  try {
    const auth = new GoogleAuth({
      scopes: 'https://www.googleapis.com/auth/cloud-platform'
    });
    const client = await auth.getClient();
    const credentials = await client.getAccessToken();
    const token = credentials.token;
    
    if (!token) {
      console.log("Could not obtain access token from environment.");
      return;
    }

    const projectId = "meu-painel-e6a63";
    const baseUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/users_data`;

    console.log("Fetching users_data documents...");
    const res = await fetch(baseUrl, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!res.ok) {
      console.log(`Error from Firestore API: ${res.status} ${res.statusText}`);
      const text = await res.text();
      console.log(text);
      return;
    }

    const data = await res.json();
    console.log("Firestore Result:");
    console.log(JSON.stringify(data, null, 2));

    if (data.documents && data.documents.length > 0) {
      for (const doc of data.documents) {
        console.log(`Document Path: ${doc.name}`);
        const parts = doc.name.split('/');
        const uid = parts[parts.length - 1];
        console.log(`UID: ${uid}`);
        
        // Let's get the fields
        const fields = doc.fields || {};
        console.log(`userName: ${fields.userName?.stringValue}`);
        console.log(`databaseVersion: ${fields.databaseVersion?.stringValue}`);
        console.log(`migrationStatus: ${fields.migrationStatus?.stringValue}`);
        console.log(`Has appData: ${!!fields.appData}`);
        if (fields.appData) {
          console.log(`appData size (JSON chars): ${JSON.stringify(fields.appData).length}`);
        }
        
        // Let's list subcollections
        const subcollectionsUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents:listCollectionIds`;
        const subRes = await fetch(subcollectionsUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            parent: doc.name
          })
        });
        
        if (subRes.ok) {
          const subData = await subRes.json();
          console.log(`Subcollections for ${uid}:`, subData.collectionIds || []);
          if (subData.collectionIds) {
            for (const colId of subData.collectionIds) {
              const colDocsUrl = `${doc.name}/${colId}`;
              const colDocsRes = await fetch(colDocsUrl, {
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              });
              if (colDocsRes.ok) {
                const colDocsData = await colDocsRes.json();
                console.log(`  Subcollection ${colId} documents count: ${colDocsData.documents ? colDocsData.documents.length : 0}`);
              } else {
                console.log(`  Failed to fetch documents for ${colId}`);
              }
            }
          }
        } else {
          console.log(`Failed to list subcollections for ${uid}: ${subRes.status}`);
        }
      }
    } else {
      console.log("No documents found in users_data.");
    }
  } catch (err) {
    console.error("Catastrophic error in script:", err);
  }
}

run();
