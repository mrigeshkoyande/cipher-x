import os
import hashlib
from datetime import datetime, timezone
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from app.core.config import settings

class PDFReportService:
    @staticmethod
    def generate_compliance_report(
        report_id: str,
        title: str,
        device_name: str,
        vendor: str,
        platform: str,
        config_version: int,
        sha256_hash: str,
        framework_code: str,
        compliance_score: float,
        findings_data: list
    ) -> str:
        pdf_filename = f"report_{report_id}.pdf"
        output_path = os.path.join(settings.STORAGE_DIR, pdf_filename)
        
        doc = SimpleDocTemplate(
            output_path,
            pagesize=letter,
            rightMargin=36,
            leftMargin=36,
            topMargin=36,
            bottomMargin=36
        )

        styles = getSampleStyleSheet()
        
        title_style = ParagraphStyle(
            'ReportTitle',
            parent=styles['Heading1'],
            fontSize=22,
            leading=26,
            textColor=colors.HexColor('#111513'),
            spaceAfter=6
        )
        
        subtitle_style = ParagraphStyle(
            'ReportSubtitle',
            parent=styles['Normal'],
            fontSize=11,
            leading=14,
            textColor=colors.HexColor('#687066'),
            spaceAfter=15
        )

        heading_style = ParagraphStyle(
            'SectionHeading',
            parent=styles['Heading2'],
            fontSize=14,
            leading=18,
            textColor=colors.HexColor('#111513'),
            spaceBefore=12,
            spaceAfter=8
        )

        body_style = ParagraphStyle(
            'Body',
            parent=styles['Normal'],
            fontSize=10,
            leading=14,
            textColor=colors.HexColor('#111513')
        )

        elements = []

        # Title Block
        elements.append(Paragraph(f"CIPHER-X — {title}", title_style))
        elements.append(Paragraph(f"Generated: {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S UTC')} | Report ID: {report_id}", subtitle_style))
        elements.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#D2D5C4'), spaceAfter=15))

        # Metadata Table
        meta_data = [
            [Paragraph("<b>Target Asset:</b>", body_style), Paragraph(device_name, body_style), Paragraph("<b>Vendor/OS:</b>", body_style), Paragraph(f"{vendor} ({platform})", body_style)],
            [Paragraph("<b>Config Version:</b>", body_style), Paragraph(f"v{config_version}", body_style), Paragraph("<b>Framework:</b>", body_style), Paragraph(framework_code, body_style)],
            [Paragraph("<b>SHA-256 Hash:</b>", body_style), Paragraph(f"{sha256_hash[:16]}...", body_style), Paragraph("<b>Compliance Score:</b>", body_style), Paragraph(f"<b>{compliance_score:.1f}%</b>", body_style)],
        ]
        t_meta = Table(meta_data, colWidths=[110, 150, 110, 150])
        t_meta.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F0F1E4')),
            ('PADDING', (0,0), (-1,-1), 8),
            ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#D2D5C4')),
            ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ]))
        elements.append(t_meta)
        elements.append(Spacer(1, 15))

        # Findings Section
        elements.append(Paragraph("Security Audit Findings & Evidence", heading_style))
        
        findings_table_data = [
            [Paragraph("<b>Control</b>", body_style), Paragraph("<b>Status</b>", body_style), Paragraph("<b>Severity</b>", body_style), Paragraph("<b>Evidence / Remediation</b>", body_style)]
        ]

        for f in findings_data:
            status = f.get("status", "UNKNOWN")
            status_color = colors.HexColor('#25B981') if status == "PASS" else colors.HexColor('#E05A61') if status == "FAIL" else colors.HexColor('#F0A13A')
            
            status_p = Paragraph(f"<font color='{status_color.hexval()}'><b>{status}</b></font>", body_style)
            sev_p = Paragraph(f"<b>{f.get('severity', 'MEDIUM')}</b>", body_style)
            ctrl_p = Paragraph(f"<b>{f.get('control_id')}</b><br/>{f.get('title')}", body_style)
            
            ev_text = f.get('evidence_text', 'N/A') or 'N/A'
            rem_text = f.get('remediation_command', '')
            details_html = f"<b>Evidence (lines {f.get('start_line')}-{f.get('end_line')}):</b><br/><code>{ev_text[:120]}</code>"
            if rem_text:
                details_html += f"<br/><br/><b>Advisory Remediation:</b><br/><code>{rem_text}</code>"
            
            details_p = Paragraph(details_html, body_style)
            
            findings_table_data.append([ctrl_p, status_p, sev_p, details_p])

        t_findings = Table(findings_table_data, colWidths=[120, 60, 70, 270])
        t_findings.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#E1E4D3')),
            ('PADDING', (0,0), (-1,-1), 6),
            ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#D2D5C4')),
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ]))
        elements.append(t_findings)

        # Integrity footer
        elements.append(Spacer(1, 20))
        elements.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor('#D2D5C4'), spaceAfter=10))
        elements.append(Paragraph(f"Immutable Record — Signature SHA-256: {sha256_hash}", subtitle_style))

        doc.build(elements)
        return output_path
