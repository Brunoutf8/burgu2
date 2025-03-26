import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  label: {
    width: 100,
    fontSize: 12,
  },
  value: {
    flex: 1,
    fontSize: 12,
  },
  item: {
    flexDirection: 'row',
    marginBottom: 5,
    fontSize: 12,
  },
  itemName: {
    flex: 1,
  },
  itemQuantity: {
    width: 50,
    textAlign: 'right',
  },
  itemPrice: {
    width: 80,
    textAlign: 'right',
  },
  total: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderColor: '#000',
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 10,
  },
  totalValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});

interface OrderPDFProps {
  items: Array<{
    name: string;
    price: number;
    quantity: number;
  }>;
  formData: {
    name: string;
    phone: string;
    address: string;
    cep: string;
    paymentMethod: string;
    change?: string;
  };
  total: number;
}

export default function OrderPDF({ items, formData, total }: OrderPDFProps) {
  return (
    
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Pedido - BurgerHouse</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações do Cliente</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Nome:</Text>
            <Text style={styles.value}>{formData.name}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Telefone:</Text>
            <Text style={styles.value}>{formData.phone}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>CEP:</Text>
            <Text style={styles.value}>{formData.cep}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Endereço:</Text>
            <Text style={styles.value}>{formData.address}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Itens do Pedido</Text>
          {items.map((item, index) => (
            <View key={index} style={styles.item}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemQuantity}>{item.quantity}x</Text>
              <Text style={styles.itemPrice}>
                R$ {(item.price * item.quantity).toFixed(2)}
              </Text>
            </View>
          ))}
          <View style={styles.total}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalValue}>R$ {total.toFixed(2)}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pagamento</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Método:</Text>
            <Text style={styles.value}>
              {formData.paymentMethod === 'money' && 'Dinheiro'}
              {formData.paymentMethod === 'card' && 'Cartão'}
              {formData.paymentMethod === 'pix' && 'PIX'}
            </Text>
          </View>
          {formData.paymentMethod === 'money' && formData.change && (
            <View style={styles.row}>
              <Text style={styles.label}>Troco para:</Text>
              <Text style={styles.value}>R$ {formData.change}</Text>
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
}