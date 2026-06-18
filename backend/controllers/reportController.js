import Report from '../models/Report.js';
import Contribution from '../models/Contribution.js';
import User from '../models/User.js';
import logger from '../utils/logger.js';

export const generateReport = async (req, res) => {
  const { format, period } = req.body;
  if (!format || !['pdf', 'csv'].includes(format)) {
    return res.status(400).json({ error: 'Format must be pdf or csv' });
  }

  const report = await Report.create({
    userId: req.userId,
    format,
    status: 'ready',
    period: period ?? 'all_time',
  });

  res.json({
    id: report._id,
    format: report.format,
    status: report.status,
    downloadUrl: report.downloadUrl,
    createdAt: report.createdAt,
  });
};

export const listReports = async (req, res) => {
  const reports = await Report.find({ userId: req.userId }).sort({ createdAt: -1 }).limit(20);

  res.json(
    reports.map((r) => ({
      id: r._id,
      format: r.format,
      status: r.status,
      downloadUrl: r.downloadUrl,
      createdAt: r.createdAt,
    }))
  );
};

export const downloadReport = async (req, res) => {
  const reportId = req.params.id;

  const report = await Report.findOne({ _id: reportId, userId: req.userId });
  if (!report) {
    return res.status(404).json({ error: 'Report not found' });
  }

  const user = await User.findById(req.userId);
  const period = report.period ?? 'all_time';

  let dateFilter = {};
  const now = Date.now();
  if (period === 'week') dateFilter = { contributionDate: { $gte: new Date(now - 7 * 86400000) } };
  else if (period === 'month') dateFilter = { contributionDate: { $gte: new Date(now - 30 * 86400000) } };
  else if (period === 'quarter') dateFilter = { contributionDate: { $gte: new Date(now - 90 * 86400000) } };
  else if (period === 'year') dateFilter = { contributionDate: { $gte: new Date(now - 365 * 86400000) } };

  const contributions = await Contribution.find({ userId: req.userId, ...dateFilter })
    .sort({ contributionDate: -1 })
    .limit(1000);

  if (report.format === 'csv') {
    const headers = ['Date', 'Type', 'Title', 'Repository', 'URL'];
    const rows = contributions.map((c) =>
      [
        new Date(c.contributionDate).toISOString().slice(0, 10),
        c.type,
        `"${c.title.replace(/"/g, '""')}"`,
        `${c.repoOwner}/${c.repoName}`,
        c.url,
      ].join(',')
    );
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="opensourcex-report-${reportId}.csv"`);
    return res.send([headers.join(','), ...rows].join('\n'));
  }

  try {
    const PDFDocument = (await import('pdfkit')).default;
    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="opensourcex-report-${reportId}.pdf"`);
    doc.pipe(res);

    doc.fontSize(24).fillColor('#22c55e').text('OpenSourceX', 50, 50);
    doc.fontSize(12).fillColor('#888888').text('Contribution Report', 50, 82);
    doc
      .fontSize(10)
      .fillColor('#888888')
      .text(`Generated: ${new Date().toLocaleDateString()} | Period: ${period.replace(/_/g, ' ')}`, 50, 100);
    doc.moveTo(50, 125).lineTo(545, 125).strokeColor('#333333').stroke();
    doc.fontSize(14).fillColor('#ffffff').text(user?.username ?? 'Unknown', 50, 140);
    doc
      .fontSize(10)
      .fillColor('#888888')
      .text(`Score: ${user?.contributionScore ?? 0} pts`, 50, 158);

    const commits = contributions.filter((c) => c.type === 'commit').length;
    const prs = contributions.filter((c) => c.type === 'pull_request').length;
    const issues = contributions.filter((c) => c.type === 'issue').length;

    doc.moveTo(50, 180).lineTo(545, 180).strokeColor('#333333').stroke();
    doc.fontSize(12).fillColor('#22c55e').text('Summary', 50, 194);
    doc
      .fontSize(10)
      .fillColor('#cccccc')
      .text(`Total: ${contributions.length}`, 50, 214)
      .text(`Commits: ${commits}`, 50, 230)
      .text(`Pull Requests: ${prs}`, 50, 246)
      .text(`Issues: ${issues}`, 50, 262);

    if (contributions.length > 0) {
      doc.moveTo(50, 285).lineTo(545, 285).strokeColor('#333333').stroke();
      doc.fontSize(12).fillColor('#22c55e').text('Contribution History', 50, 298);
      let y = 318;
      for (const c of contributions.slice(0, 60)) {
        if (y > 750) {
          doc.addPage();
          y = 50;
        }
        doc
          .fontSize(8)
          .fillColor('#aaaaaa')
          .text(new Date(c.contributionDate).toISOString().slice(0, 10), 50, y);
        doc.fontSize(8).fillColor('#22c55e').text(c.type.toUpperCase(), 120, y);
        doc
          .fontSize(8)
          .fillColor('#cccccc')
          .text(`${c.repoOwner}/${c.repoName}`, 200, y);
        doc.fontSize(8).fillColor('#999999').text(c.title.slice(0, 45), 350, y);
        y += 16;
      }
      if (contributions.length > 60) {
        doc
          .fontSize(8)
          .fillColor('#666666')
          .text(`... and ${contributions.length - 60} more`, 50, y + 8);
      }
    }

    doc.end();
  } catch (err) {
    logger.error('PDF generation error:', err.message);
    res.status(500).json({ error: 'PDF generation failed' });
  }
};
