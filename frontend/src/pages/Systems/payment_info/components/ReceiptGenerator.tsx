import React, { useState } from 'react';
import { Button, message } from 'antd';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import { FilePdfOutlined, EyeOutlined } from '@ant-design/icons';
import ReceiptPDF from './ReceiptPDF';

interface ReceiptGeneratorProps {
  paymentData: {
    patientName: string;
    patientPhone: string;
    patientAddress: string;
    treatmentType: string;
    amount: number;
    paymentMethod: string;
    paymentDate: string;
    dentistName: string;
    appointmentDate: string;
    appointmentTime: string;
  };
}

const ReceiptGenerator: React.FC<ReceiptGeneratorProps> = ({ paymentData }) => {
  const [showPreview, setShowPreview] = useState(false);

  // Generate invoice number
  const generateInvoiceNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `INV-${year}${month}${day}-${random}`;
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  // Prepare receipt data
  const receiptData = {
    invoiceNumber: generateInvoiceNumber(),
    date: formatDate(paymentData.paymentDate),
    businessName: 'คลินิกทันตกรรม TooThoot',
    businessAddress: '123 ถนนสุขุมวิท',
    businessCity: 'กรุงเทพฯ 10110, ประเทศไทย',
    businessPhone: '02-123-4567',
    businessFax: '02-123-4568',
    businessWeb: 'www.toothoot.com',
    clientName: paymentData.patientName,
    clientAddress: paymentData.patientAddress || '123 ถนนผู้ป่วย',
    clientCity: 'กรุงเทพฯ 10110, ประเทศไทย',
    clientPhone: paymentData.patientPhone,
    clientFax: '-',
    clientWeb: '-',
    dentist: paymentData.dentistName || 'ทพ. สมชาย ใจดี',
    procedure: paymentData.treatmentType,
    appointmentDate: formatDate(paymentData.appointmentDate),
    appointmentTime: paymentData.appointmentTime,
    appointmentEnd: '-',
    items: [
      {
        name: paymentData.treatmentType,
        price: paymentData.amount,
        labor: 0,
        total: paymentData.amount
      }
    ],
    totalAmount: paymentData.amount
  };

  const handleDownloadSuccess = () => {
    message.success('ใบเสร็จถูกดาวน์โหลดเรียบร้อยแล้ว');
  };

  const handleDownloadError = () => {
    message.error('เกิดข้อผิดพลาดในการดาวน์โหลดใบเสร็จ');
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
        <Button
          type="primary"
          icon={<EyeOutlined />}
          onClick={() => setShowPreview(!showPreview)}
        >
          {showPreview ? 'ซ่อนตัวอย่าง' : 'ดูตัวอย่างใบเสร็จ'}
        </Button>

        <PDFDownloadLink
          document={<ReceiptPDF data={receiptData} />}
          fileName={`receipt-${receiptData.invoiceNumber}.pdf`}
        >
          {({ loading }) => (
            <Button
              type="default"
              icon={<FilePdfOutlined />}
              loading={loading}
              disabled={loading}
              onClick={() => {
                if (!loading) {
                  handleDownloadSuccess();
                }
              }}
            >
              {loading ? 'กำลังสร้าง PDF...' : 'ดาวน์โหลดใบเสร็จ'}
            </Button>
          )}
        </PDFDownloadLink>
      </div>

      {showPreview && (
        <div style={{ 
          border: '1px solid #d9d9d9', 
          borderRadius: '8px', 
          overflow: 'hidden',
          height: '600px',
          marginTop: '16px'
        }}>
          <PDFViewer 
            width="100%" 
            height="100%"
            showToolbar={false}
          >
            <ReceiptPDF data={receiptData} />
          </PDFViewer>
        </div>
      )}
    </div>
  );
};

export default ReceiptGenerator;
