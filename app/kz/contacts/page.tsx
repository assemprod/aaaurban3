import type { Metadata } from "next";
import CorporatePageRoute from "../../corporate-page-route";
import { buildCorporateMetadata } from "../../corporate-pages-data";

export const metadata: Metadata = buildCorporateMetadata("contacts", "kz");
export default function ContactsPage() { return <CorporatePageRoute kind="contacts" lang="kz" />; }
