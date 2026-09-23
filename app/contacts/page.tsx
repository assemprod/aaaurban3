import type { Metadata } from "next";
import CorporatePageRoute from "../corporate-page-route";
import { buildCorporateMetadata } from "../corporate-pages-data";

export const metadata: Metadata = buildCorporateMetadata("contacts", "ru");
export default function ContactsPage() { return <CorporatePageRoute kind="contacts" lang="ru" />; }
