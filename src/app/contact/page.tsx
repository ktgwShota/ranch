import type { Metadata } from 'next';
import ContactForm from './ContactForm';

export const metadata: Metadata = {
  title: 'お問い合わせ',
  description: 'Choisur（チョイスル）に対するお問い合わせはこちらをご利用ください',
  openGraph: {
    title: 'お問い合わせ',
    description: 'Choisur（チョイスル）に対するお問い合わせはこちらをご利用ください',
  },
};

export default function ContactPage() {
  return <ContactForm />;
}
