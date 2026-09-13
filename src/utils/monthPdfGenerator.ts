import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ArchivedMonthData } from '../types';

export function generateMonthPdf(archive: ArchivedMonthData, userName: string = 'Usuário') {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Primary brand colors
  const primaryColor: [number, number, number] = [79, 70, 229]; // Indigo 600
  const darkTextColor: [number, number, number] = [30, 41, 59]; // Slate 800
  const grayTextColor: [number, number, number] = [100, 116, 139]; // Slate 500
  const greenColor: [number, number, number] = [16, 185, 129]; // Emerald 500
  const redColor: [number, number, number] = [239, 68, 68]; // Red 500

  // Header Banner
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, pageWidth, 28, 'F');

  // Title in Banner
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('MEU PAINEL DE VIDA', 14, 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Relatório Oficial de Fechamento Mensal', 14, 18);

  // Month & Year Tag (Right-aligned in header)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text(`${archive.monthName.toUpperCase()} / ${archive.year}`, pageWidth - 14, 13, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(`Finalizado em: ${archive.finalizedAt}`, pageWidth - 14, 19, { align: 'right' });

  let currentY = 36;

  // Metadata Card
  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, currentY, pageWidth - 28, 16, 2, 2, 'FD');

  doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text(`Titular do Painel: ${userName}`, 18, currentY + 7);

  doc.setTextColor(grayTextColor[0], grayTextColor[1], grayTextColor[2]);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(`Arquivo Histórico Permanente • Total de Transações: ${archive.finance.length} • Total de Tarefas: ${archive.tasks.length}`, 18, currentY + 12);

  currentY += 22;

  // Section 1: RESUMO FINANCEIRO
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('1. RESUMO FINANCEIRO', 14, currentY);

  currentY += 5;

  const cardWidth = (pageWidth - 28 - 8) / 3;
  const cardHeight = 20;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  // Card 1: Receitas
  doc.setDrawColor(209, 250, 229);
  doc.setFillColor(236, 253, 245);
  doc.roundedRect(14, currentY, cardWidth, cardHeight, 2, 2, 'FD');
  doc.setTextColor(6, 95, 70);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('RECEITAS TOTAIS', 18, currentY + 6);
  doc.setFontSize(11);
  doc.text(formatCurrency(archive.summary.totalIncome), 18, currentY + 14);

  // Card 2: Despesas
  const card2X = 14 + cardWidth + 4;
  doc.setDrawColor(254, 202, 202);
  doc.setFillColor(254, 242, 242);
  doc.roundedRect(card2X, currentY, cardWidth, cardHeight, 2, 2, 'FD');
  doc.setTextColor(153, 27, 27);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('DESPESAS TOTAIS', card2X + 4, currentY + 6);
  doc.setFontSize(11);
  doc.text(formatCurrency(archive.summary.totalExpense), card2X + 4, currentY + 14);

  // Card 3: Saldo
  const card3X = card2X + cardWidth + 4;
  const isPositiveBalance = archive.summary.balance >= 0;
  if (isPositiveBalance) {
    doc.setDrawColor(209, 250, 229);
    doc.setFillColor(240, 253, 244);
    doc.setTextColor(22, 101, 52);
  } else {
    doc.setDrawColor(254, 202, 202);
    doc.setFillColor(255, 241, 242);
    doc.setTextColor(159, 18, 57);
  }
  doc.roundedRect(card3X, currentY, cardWidth, cardHeight, 2, 2, 'FD');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('SALDO FINAL DO MÊS', card3X + 4, currentY + 6);
  doc.setFontSize(11);
  doc.text(formatCurrency(archive.summary.balance), card3X + 4, currentY + 14);

  currentY += cardHeight + 7;

  // Table: Finance Transactions
  const categoryLabels: Record<string, string> = {
    personal: 'Pessoal',
    work: 'Trabalho',
    stationery: 'Papelaria'
  };

  const financeRows = archive.finance.map(f => [
    f.date ? f.date.split('-').reverse().join('/') : '-',
    f.type === 'income' ? 'Receita (+)' : 'Despesa (-)',
    f.description || 'Sem descrição',
    categoryLabels[f.category] || f.category || 'Geral',
    `${f.type === 'income' ? '+' : '-'} ${formatCurrency(f.amount)}`
  ]);

  if (financeRows.length > 0) {
    autoTable(doc, {
      startY: currentY,
      head: [['Data', 'Tipo', 'Descrição', 'Categoria', 'Valor']],
      body: financeRows,
      theme: 'grid',
      headStyles: {
        fillColor: [79, 70, 229],
        textColor: 255,
        fontStyle: 'bold',
        fontSize: 8.5
      },
      styles: {
        fontSize: 8,
        textColor: [30, 41, 59],
        cellPadding: 2.5
      },
      columnStyles: {
        0: { cellWidth: 24 },
        1: { cellWidth: 26, fontStyle: 'bold' },
        2: { cellWidth: 'auto' },
        3: { cellWidth: 30 },
        4: { cellWidth: 32, halign: 'right', fontStyle: 'bold' }
      },
      didParseCell: (data) => {
        if (data.section === 'body' && data.column.index === 4) {
          const val = data.cell.raw as string;
          if (val.startsWith('+')) {
            data.cell.styles.textColor = [16, 185, 129];
          } else {
            data.cell.styles.textColor = [239, 68, 68];
          }
        }
      }
    });

    currentY = (doc as any).lastAutoTable.finalY + 9;
  } else {
    doc.setTextColor(grayTextColor[0], grayTextColor[1], grayTextColor[2]);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8.5);
    doc.text('Nenhuma movimentação financeira foi registrada neste mês.', 14, currentY + 3);
    currentY += 12;
  }

  // Check if we need a new page for Tasks
  if (currentY > pageHeight - 60) {
    doc.addPage();
    currentY = 20;
  }

  // Section 2: MINHAS TAREFAS
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('2. ORGANIZAÇÃO → MINHAS TAREFAS', 14, currentY);

  currentY += 5;

  // Task Summary Bar
  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, currentY, pageWidth - 28, 13, 2, 2, 'FD');

  const taskPct = archive.summary.totalTasks > 0
    ? Math.round((archive.summary.completedTasks / archive.summary.totalTasks) * 100)
    : 0;

  doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.text(`Total de Tarefas: ${archive.summary.totalTasks}`, 18, currentY + 8);

  doc.setTextColor(greenColor[0], greenColor[1], greenColor[2]);
  doc.text(`Concluídas: ${archive.summary.completedTasks}`, 70, currentY + 8);

  doc.setTextColor(grayTextColor[0], grayTextColor[1], grayTextColor[2]);
  doc.text(`Pendentes: ${archive.summary.pendingTasks}`, 115, currentY + 8);

  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text(`Taxa de Conclusão: ${taskPct}%`, pageWidth - 20, currentY + 8, { align: 'right' });

  currentY += 18;

  const taskRows = archive.tasks.map(t => [
    t.completed ? '[CONCLUÍDA]' : '[PENDENTE]',
    t.type === 'today' ? 'Hoje' : 'Pendente',
    t.text,
    t.createdAt ? t.createdAt.split('-').reverse().join('/') : '-'
  ]);

  if (taskRows.length > 0) {
    autoTable(doc, {
      startY: currentY,
      head: [['Status', 'Tipo', 'Descrição da Tarefa', 'Criada em']],
      body: taskRows,
      theme: 'grid',
      headStyles: {
        fillColor: [79, 70, 229],
        textColor: 255,
        fontStyle: 'bold',
        fontSize: 8.5
      },
      styles: {
        fontSize: 8,
        textColor: [30, 41, 59],
        cellPadding: 2.5
      },
      columnStyles: {
        0: { cellWidth: 30, fontStyle: 'bold' },
        1: { cellWidth: 24 },
        2: { cellWidth: 'auto' },
        3: { cellWidth: 26, halign: 'center' }
      },
      didParseCell: (data) => {
        if (data.section === 'body' && data.column.index === 0) {
          const val = data.cell.raw as string;
          if (val === '[CONCLUÍDA]') {
            data.cell.styles.textColor = [16, 185, 129];
          } else {
            data.cell.styles.textColor = [234, 88, 12];
          }
        }
      }
    });
  } else {
    doc.setTextColor(grayTextColor[0], grayTextColor[1], grayTextColor[2]);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8.5);
    doc.text('Nenhuma tarefa foi registrada neste mês.', 14, currentY + 3);
  }

  // Footer on all pages
  const totalPages = (doc.internal as any).getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setDrawColor(226, 232, 240);
    doc.line(14, pageHeight - 12, pageWidth - 14, pageHeight - 12);

    doc.setTextColor(grayTextColor[0], grayTextColor[1], grayTextColor[2]);
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.text(`Meu Painel de Vida • Fechamento Mensal: ${archive.monthName} / ${archive.year}`, 14, pageHeight - 7);
    doc.text(`Página ${i} de ${totalPages}`, pageWidth - 14, pageHeight - 7, { align: 'right' });
  }

  // Save the PDF
  const sanitizedMonth = archive.monthName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const fileName = `Fechamento_${sanitizedMonth}_${archive.year}.pdf`;
  doc.save(fileName);
}
