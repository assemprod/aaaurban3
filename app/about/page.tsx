import type { Metadata } from "next";
import CorporatePageRoute from "../corporate-page-route";
import { buildCorporateMetadata } from "../corporate-pages-data";

export const metadata: Metadata = buildCorporateMetadata("about", "ru");
export default function AboutPage() { return <CorporatePageRoute kind="about" lang="ru" />; }
