
import { Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer'
import { SPTFormData } from '@/types'
import { formatDate, formatCurrency } from '@/utils/formatters'

Font.registerHyphenationCallback(word => {
    // Return entire word as unique part
    return [word];
});

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 70,
        paddingTop: 40,
        paddingBottom: 40,
        fontFamily: 'Times-Roman',
    },
    // Header with logo and company name

    // Content sections
    section: {
        marginTop: 40,
        marginBottom: 15,
    },
    // Body paragraphs
    textNoIndent: {
        fontSize: 12,
        lineHeight: 2,
        textAlign: 'justify',
    },
    marginPerihal: {
        marginBottom: 10,
    },
    paragraph: {
        textIndent: 25,
        fontSize: 12,
        lineHeight: 2,
        textAlign: 'justify',
        marginBottom: 5,
    },
    paragraphNoMargin: {
        textIndent: 25,
        fontSize: 12,
        lineHeight: 2,
        textAlign: 'justify',
    },
    textHeader: {
        fontSize: 12,
        lineHeight: 2,
        textAlign: 'justify',
    },
    boldData: {
        fontWeight: 'bold',
    },
    // Footer/Signature
    signatureSection: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    signatureBlock: {
        width: '45%',
    },
    signatureLine: {
        textAlign: 'right',
        fontSize: 12,
        marginBottom: 6,
    },
    signatureName: {
        textAlign: 'right',
        fontSize: 12,
        fontWeight: 'bold',
    },
    signatureTitle: {
        textAlign: 'right',
        fontSize: 12,
    },
})

interface PdfDocumentProps {
    data: SPTFormData
}

const PdfDocument = ({ data }: PdfDocumentProps) => {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <Image src="/logo_acc.jpg" style={{ width: 75, marginBottom: 20, marginTop: 20 }} />
                <View>

                    <Text style={styles.textHeader}>PT. ASTRA SEDAYA FINANCE</Text>
                    <Text style={styles.textHeader}>Kepada Yth.</Text>
                    <Text style={styles.textHeader}>Bapak/Ibu <Text style={styles.boldData}>{data.nama_customer.toUpperCase()}</Text></Text>
                    <Text style={styles.textHeader}>di tempat</Text>
                </View>

                {/* Warning paragraph */}
                <View style={styles.section} wrap={false}>
                    <Text style={[styles.textNoIndent, styles.marginPerihal]}>
                        Perihal     : Peringatan Terakhir
                    </Text>
                    <Text style={styles.textNoIndent}>
                        Dengan hormat,
                    </Text>
                    <Text style={styles.paragraph}>
                        Sesuai dengan perjanjian pembiayaan dengan penyerahan Hak Milik Fidusia : <Text style={styles.boldData}>{data.nomor_kontrak}</Text> No Lang: <Text style={styles.boldData}>{data.nomor_langganan}</Text> menurut catatan kami angsuran Bapak/Ibu ke-<Text style={styles.boldData}>{data.angsuran_ke}</Text> sebesar <Text style={styles.boldData}>{formatCurrency(data.nominal_angsuran)}</Text> yang jatuh tempo pada tanggal <Text style={styles.boldData}>{formatDate(data.tanggal_jatuh_tempo)}</Text> sampai hari ini belum dilunasi.
                    </Text>
                    <Text style={styles.paragraph}>
                        Oleh karena itu, kami mohon Bapak/Ibu melunasi angsuran tersebut diatas beserta denda keterlambatannya paling lambat tanggal  <Text style={styles.boldData}>{formatDate(data.tanggal_maksimal_pembayaran)}</Text>.
                    </Text>
                    <Text style={styles.paragraphNoMargin}>
                        Apabila sampai batas waktu yang ditentukan ternyata Bapak/Ibu belum juga menyelesaikan kewajiban tersebut diatas, maka dengan sangat menyesal petugas kami akan <Text style={styles.boldData}>melakukan penarikan kendaraan/barang tersebut</Text>. Seluruh biaya yang timbul akibat penarikan ini menjadi beban dan tanggung jawab Bapak/Ibu.
                    </Text>
                    <Text style={styles.textNoIndent}>
                        Atas perhatian Bapak/Ibu, kami ucapkan terima kasih.
                    </Text>
                </View>

                {/* Signature Section */}
                <View style={styles.signatureSection}>
                    <View style={styles.signatureBlock}>
                        {/* Empty left column */}
                    </View>
                    <View style={styles.signatureBlock}>
                        <View style={{ marginBottom: 60 }}>
                            <Text style={styles.signatureLine}>
                                <Text style={styles.boldData}>Pontianak, {formatDate(data.tanggal_pembuatan_spt)}</Text>
                            </Text>
                            <Text style={styles.signatureLine}>
                                Hormat Kami,
                            </Text>
                        </View>
                        <Text style={styles.signatureTitle}>
                            PT. ASTRA SEDAYA FINANCE
                        </Text>
                    </View>
                </View>
            </Page>
        </Document>
    )
}

export default PdfDocument
