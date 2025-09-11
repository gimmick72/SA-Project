import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Register Thai Sarabun font
Font.register({
  family: 'Sarabun',
  fonts: [
    {
      src: 'https://fonts.gstatic.com/s/sarabun/v13/DtVjJx26TKEqaowiEC2Ja_4j_A.woff2',
      fontWeight: 'normal',
    },
    {
      src: 'https://fonts.gstatic.com/s/sarabun/v13/DtVmJx26TKEqaowiEC2Jk9-8nKhq.woff2',
      fontWeight: 'bold',
    },
  ],
});

// Define styles for the PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
    fontSize: 10,
    fontFamily: 'Sarabun',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 30,
  },
  leftHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 60,
    height: 60,
    marginRight: 15,
    backgroundColor: '#1890ff',
    borderRadius: 30,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    letterSpacing: 1,
    fontFamily: 'Sarabun',
  },
  rightHeader: {
    alignItems: 'flex-end',
  },
  invoiceInfo: {
    fontSize: 10,
    marginBottom: 3,
    fontFamily: 'Sarabun',
  },
  businessInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  businessSection: {
    flex: 1,
    marginRight: 20,
  },
  shipToSection: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000000',
    fontFamily: 'Sarabun',
  },
  infoLine: {
    fontSize: 9,
    marginBottom: 2,
    fontFamily: 'Sarabun',
    color: '#333333',
  },
  appointmentTable: {
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    paddingBottom: 5,
    marginBottom: 10,
  },
  tableHeaderCell: {
    fontSize: 8,
    fontWeight: 'bold',
    padding: 5,
    textAlign: 'center',
    backgroundColor: '#f0f0f0',
    border: '1px solid #000000',
    fontFamily: 'Sarabun',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#CCCCCC',
  },
  tableCell: {
    fontSize: 8,
    padding: 5,
    textAlign: 'center',
    border: '1px solid #000000',
    fontFamily: 'Sarabun',
  },
  itemsTable: {
    marginBottom: 20,
  },
  itemsTableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    paddingBottom: 5,
    marginBottom: 10,
  },
  itemsHeaderCell: {
    fontSize: 8,
    fontWeight: 'bold',
    padding: 5,
    textAlign: 'center',
    backgroundColor: '#f0f0f0',
    border: '1px solid #000000',
    fontFamily: 'Sarabun',
  },
  itemNameCell: {
    flex: 2,
  },
  itemPriceCell: {
    flex: 1.5,
  },
  itemLaborCell: {
    flex: 1,
  },
  itemTotalCell: {
    flex: 1,
  },
  itemsRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#CCCCCC',
    minHeight: 40,
  },
  itemsCell: {
    fontSize: 8,
    padding: 6,
    textAlign: 'center',
    borderBottom: '1px solid #cccccc',
    fontFamily: 'Sarabun',
  },
  totalRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#000000',
    paddingTop: 10,
    marginTop: 10,
  },
  totalCell: {
    flex: 3,
  },
  totalAmountCell: {
    fontSize: 10,
    fontWeight: 'bold',
    padding: 8,
    textAlign: 'right',
    backgroundColor: '#f0f0f0',
    borderTop: '2px solid #000000',
    fontFamily: 'Sarabun',
  },
  footer: {
    marginTop: 30,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 9,
    marginBottom: 5,
    textAlign: 'center',
    fontFamily: 'Sarabun',
  },
  thankYou: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
    fontFamily: 'Sarabun',
  },
  website: {
    fontSize: 8,
    textAlign: 'center',
    color: '#666666',
    fontFamily: 'Sarabun',
  },
});

interface ReceiptData {
  invoiceNumber: string;
  date: string;
  businessName: string;
  businessAddress: string;
  businessCity: string;
  businessPhone: string;
  businessFax: string;
  businessWeb: string;
  clientName: string;
  clientAddress: string;
  clientCity: string;
  clientPhone: string;
  clientFax: string;
  clientWeb: string;
  dentist: string;
  procedure: string;
  appointmentDate: string;
  appointmentTime: string;
  appointmentEnd: string;
  items: Array<{
    name: string;
    price: number;
    labor: number;
    total: number;
  }>;
  totalAmount: number;
}

interface ReceiptPDFProps {
  data: ReceiptData;
}

const ReceiptPDF: React.FC<ReceiptPDFProps> = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.leftHeader}>
          <View style={styles.logo} />
          <Text style={styles.title}>ใบเสร็จรับเงิน</Text>
        </View>
        <View style={styles.rightHeader}>
          <Text style={styles.invoiceInfo}>เลขที่ใบเสร็จ: {data.invoiceNumber}</Text>
          <Text style={styles.invoiceInfo}>วันที่: {data.date}</Text>
        </View>
      </View>

      {/* Business and Client Info */}
      <View style={styles.businessInfo}>
        <View style={styles.businessSection}>
          <Text style={styles.infoLine}>ชื่อคลินิก: {data.businessName}</Text>
          <Text style={styles.infoLine}>ที่อยู่: {data.businessAddress}</Text>
          <Text style={styles.infoLine}>จังหวัด/รหัสไปรษณีย์: {data.businessCity}</Text>
          <Text style={styles.infoLine}>โทรศัพท์: {data.businessPhone}</Text>
          <Text style={styles.infoLine}>แฟกซ์: {data.businessFax}</Text>
          <Text style={styles.infoLine}>เว็บไซต์: {data.businessWeb}</Text>
          
          <View style={{ marginTop: 20 }}>
            <Text style={styles.infoLine}>ชื่อผู้ป่วย: {data.clientName}</Text>
            <Text style={styles.infoLine}>ที่อยู่: {data.clientAddress}</Text>
            <Text style={styles.infoLine}>จังหวัด/รหัสไปรษณีย์: {data.clientCity}</Text>
            <Text style={styles.infoLine}>โทรศัพท์: {data.clientPhone}</Text>
            <Text style={styles.infoLine}>แฟกซ์: {data.clientFax}</Text>
            <Text style={styles.infoLine}>เว็บไซต์: {data.clientWeb}</Text>
          </View>
        </View>

        <View style={styles.shipToSection}>
          <Text style={styles.sectionTitle}>ข้อมูลผู้รับบริการ:</Text>
          <Text style={styles.infoLine}>ชื่อ: {data.clientName}</Text>
          <Text style={styles.infoLine}>ที่อยู่: {data.clientAddress}</Text>
          <Text style={styles.infoLine}>จังหวัด/รหัสไปรษณีย์: {data.clientCity}</Text>
          <Text style={styles.infoLine}>โทรศัพท์: {data.clientPhone}</Text>
        </View>
      </View>

      {/* Appointment Table */}
      <View style={styles.appointmentTable}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderCell}>ทันตแพทย์/เทคนิค</Text>
          <Text style={styles.tableHeaderCell}>การรักษา</Text>
          <Text style={styles.tableHeaderCell}>วันที่</Text>
          <Text style={styles.tableHeaderCell}>เวลานัด</Text>
          <Text style={styles.tableHeaderCell}>จำนวนเงิน</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>{data.dentist}</Text>
          <Text style={styles.tableCell}>{data.procedure}</Text>
          <Text style={styles.tableCell}>{data.appointmentDate}</Text>
          <Text style={styles.tableCell}>{data.appointmentTime}</Text>
          <Text style={styles.tableCell}>{data.appointmentEnd}</Text>
          <Text style={styles.tableCell}></Text>
        </View>
      </View>

      {/* Items Table */}
      <View style={styles.itemsTable}>
        <View style={styles.itemsTableHeader}>
          <Text style={[styles.itemsHeaderCell, styles.itemNameCell]}>รายการ</Text>
          <Text style={[styles.itemsHeaderCell, styles.itemPriceCell]}>ราคารายการ</Text>
          <Text style={[styles.itemsHeaderCell, styles.itemLaborCell]}>ค่าแรง</Text>
          <Text style={[styles.itemsHeaderCell, styles.itemTotalCell]}>รวม</Text>
        </View>
        
        {data.items.map((item, index) => (
          <View key={index} style={styles.itemsRow}>
            <Text style={[styles.itemsCell, styles.itemNameCell]}>{item.name}</Text>
            <Text style={[styles.itemsCell, styles.itemPriceCell]}>฿{item.price.toLocaleString()}</Text>
            <Text style={[styles.itemsCell, styles.itemLaborCell]}>฿{item.labor.toLocaleString()}</Text>
            <Text style={[styles.itemsCell, styles.itemTotalCell]}>฿{item.total.toLocaleString()}</Text>
          </View>
        ))}

        {/* Empty rows for spacing */}
        {Array.from({ length: Math.max(0, 6 - data.items.length) }).map((_, index) => (
          <View key={`empty-${index}`} style={styles.itemsRow}>
            <Text style={[styles.itemsCell, styles.itemNameCell]}></Text>
            <Text style={[styles.itemsCell, styles.itemPriceCell]}></Text>
            <Text style={[styles.itemsCell, styles.itemLaborCell]}></Text>
            <Text style={[styles.itemsCell, styles.itemTotalCell]}></Text>
          </View>
        ))}

        <View style={styles.totalRow}>
          <Text style={styles.totalCell}></Text>
          <Text style={styles.totalAmountCell}>฿{data.totalAmount.toLocaleString()}</Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>กรุณาออกเช็คในนาม {data.businessName}</Text>
        <Text style={styles.thankYou}>ขอบคุณที่ใช้บริการ!</Text>
        <Text style={styles.website}>คลินิกทันตกรรม</Text>
      </View>
    </Page>
  </Document>
);

export default ReceiptPDF;
