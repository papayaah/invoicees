import { Document, Font, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import { InvoiceData } from '@/types/invoice';

Font.register({
  family: 'Inter',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtQ.woff2' },
  ],
});

const styles = StyleSheet.create({
  page: { padding: 24, fontFamily: 'Inter' },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  section: { marginBottom: 12 },
  h1: { fontSize: 18, marginBottom: 8 },
  label: { fontSize: 9, color: '#6b7280', letterSpacing: 1 },
  text: { fontSize: 11, color: '#111827' },
  tableHead: { fontSize: 9, color: '#6b7280', marginTop: 16, marginBottom: 6 },
  tableRow: { flexDirection: 'row', fontSize: 10, paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  colDesc: { width: '60%' },
  colQty: { width: '10%', textAlign: 'right' },
  colPrice: { width: '15%', textAlign: 'right' },
  colTotal: { width: '15%', textAlign: 'right' },
  totalRow: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12 },
  totalBox: { width: '40%', borderTopWidth: 2, borderTopColor: '#111827', paddingTop: 8 },
});

const formatCurrency = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

export function InvoicePDF({ invoices }: { invoices: InvoiceData[] }) {
  return (
    <Document>
      {invoices.map((inv) => {
        const total = inv.items.reduce((s, it) => s + it.unitPrice * it.quantity, 0);
        return (
          <Page size="A4" style={styles.page} key={inv.id}>
            <View style={[styles.section, styles.row]}>
              <Text style={styles.h1}>INVOICE</Text>
              <Text style={styles.text}>{new Date(inv.invoiceDate || Date.now()).toLocaleDateString()}</Text>
            </View>

            <View style={[styles.section, styles.row]}>
              <View>
                <Text style={styles.label}>FROM</Text>
                <Text style={styles.text}>{inv.businessName || '—'}</Text>
                {inv.businessEmail ? <Text style={styles.text}>{inv.businessEmail}</Text> : null}
                {inv.businessPhone ? <Text style={styles.text}>{inv.businessPhone}</Text> : null}
                {inv.businessAddress ? <Text style={styles.text}>{inv.businessAddress}</Text> : null}
              </View>
              <View>
                <Text style={styles.label}>TO</Text>
                <Text style={styles.text}>{inv.clientName || '—'}</Text>
                {inv.clientEmail ? <Text style={styles.text}>{inv.clientEmail}</Text> : null}
                {inv.clientPhone ? <Text style={styles.text}>{inv.clientPhone}</Text> : null}
                {inv.clientAddress ? <Text style={styles.text}>{inv.clientAddress}</Text> : null}
              </View>
            </View>

            <Text style={styles.tableHead}>DESCRIPTION     QTY     PRICE     TOTAL</Text>
            {inv.items.map((it, idx) => (
              <View key={idx} style={styles.tableRow}>
                <Text style={styles.colDesc}>{it.description}</Text>
                <Text style={styles.colQty}>{it.quantity}</Text>
                <Text style={styles.colPrice}>{formatCurrency(it.unitPrice)}</Text>
                <Text style={styles.colTotal}>{formatCurrency(it.unitPrice * it.quantity)}</Text>
              </View>
            ))}

            <View style={styles.totalRow}>
              <View style={styles.totalBox}>
                <View style={[styles.row]}>
                  <Text style={styles.text}>TOTAL</Text>
                  <Text style={styles.text}>{formatCurrency(total)}</Text>
                </View>
              </View>
            </View>

            {inv.paymentInstructions ? (
              <View style={[styles.section, { marginTop: 16 }]}> 
                <Text style={styles.label}>PAYMENT DETAILS</Text>
                <Text style={styles.text}>{inv.paymentInstructions}</Text>
              </View>
            ) : null}

            {inv.notes ? (
              <View style={[styles.section, { marginTop: 8 }]}> 
                <Text style={styles.label}>NOTES</Text>
                <Text style={styles.text}>{inv.notes}</Text>
              </View>
            ) : null}
          </Page>
        );
      })}
    </Document>
  );
}


