import type { Metadata } from "next";
import CorporatePageRoute from "../corporate-page-route";
import { buildCorporateMetadata } from "../corporate-pages-data";

export const metadata: Metadata = buildCorporateMetadata("services", "ru");
export default function ServicesPage() { return <CorporatePageRoute kind="services" lang="ru" />; }
