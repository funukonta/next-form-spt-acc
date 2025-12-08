
import { Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer'

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        padding: 50,
        paddingTop: 40,
        fontFamily: 'Times-Roman',
    },
    // Header with logo and company name

    // Content sections
    section: {
        marginTop: 15,
        marginBottom: 15,
    },
    // Body paragraphs
    textNoIndent: {
        fontSize: 12,
        lineHeight: 1.5,
        textAlign: 'justify',
        marginBottom: 10,
    },
    paragraph: {
        textIndent: 25,
        fontSize: 12,
        lineHeight: 1.5,
        textAlign: 'justify',
        marginBottom: 10,
    },
    paragraphNoMargin: {
        textIndent: 25,
        fontSize: 12,
        lineHeight: 1.5,
        textAlign: 'justify',
    },
    textHeader: {
        fontSize: 12,
        lineHeight: 1.5,
        textAlign: 'justify',
    },
    boldData: {
        fontWeight: 'bold',
    },
    // Footer/Signature
    signatureSection: {
        marginTop: 30,
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
    data: {
        nama_arho?: string
        nama_customer: string
        nama_armh: string
        nomor_kontrak: string
        nomor_langganan: string
        angsuran_ke: string
        nominal_angsuran: string
        tanggal_jatuh_tempo: string
        tanggal_maksimal_pembayaran: string
        tanggal_pembuatan_spt: string
    }
}

const PdfDocument = ({ data }: PdfDocumentProps) => {
    const formatDate = (dateString: string) => {
        if (!dateString) return '-'
        const date = new Date(dateString)
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        })
    }

    const formatCurrency = (amount: string) => {
        if (!amount) return '-'
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(Number(amount))
    }

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <Image src="/logo_acc.jpg" style={{ width: 100, marginBottom: 20 }} />
                <View>

                    <Text style={styles.textHeader}>PT. ASTRA SEDAYA FINANCE</Text>
                    <Text style={styles.textHeader}>Kepada Yth.</Text>
                    <Text style={styles.textHeader}>Bapak/Ibu <Text style={styles.boldData}>{data.nama_customer}</Text></Text>
                    <Text style={styles.textHeader}>di tempat</Text>
                </View>

                {/* Warning paragraph */}
                <View style={styles.section}>
                    <Text style={styles.textNoIndent}>
                        Perihal     : Peringatan Terakhir
                    </Text>
                    <Text style={styles.textNoIndent}>
                        Dengan hormat,
                    </Text>
                    <Text style={styles.paragraph}>
                        Sesuai dengan perjanjian pembiayaan dengan penyerahan Hak Milik Fidusia : <Text style={styles.boldData}>{data.nomor_kontrak}</Text> dan No Lang : <Text style={styles.boldData}>{data.nomor_langganan}</Text>, menurut catatan kami per angsuran Bapak/Ibu ke-<Text style={styles.boldData}>{data.angsuran_ke}</Text> sebesar <Text style={styles.boldData}>{formatCurrency(data.nominal_angsuran)}</Text> yang jatuh tempo pada tanggal <Text style={styles.boldData}>{formatDate(data.tanggal_jatuh_tempo)}</Text> sampai hari ini belum dilunasi.
                    </Text>
                    <Text style={styles.paragraph}>
                        Oleh karena itu, kami mohon Bapak/Ibu melunasi angsuran tersebut beserta keterlambatannya paling lambat tanggal <Text style={styles.boldData}>{formatDate(data.tanggal_maksimal_pembayaran)}</Text>.
                    </Text>
                    <Text style={styles.paragraphNoMargin}>
                        Apabila sampai batas waktu yang ditentukan Bapak/Ibu belum dapat menyelesaikan kewajiban tersebut, maka dengan sangat menyesal petugas kami akan <Text style={styles.boldData}>melakukan penarikan Kendaraan/Barang dimaksud</Text>. Seluruh biaya yang timbul akibat penarikan menjadi beban dan tanggung jawab Bapak/Ibu.
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
                                Pontianak, {formatDate(data.tanggal_pembuatan_spt)}
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
