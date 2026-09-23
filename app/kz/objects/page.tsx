import type { Metadata } from "next";
import CorporatePageRoute from "../../corporate-page-route";
import { buildCorporateMetadata } from "../../corporate-pages-data";

export const metadata: Metadata = buildCorporateMetadata("objects", "kz");
export default function ObjectsPage() { return <CorporatePageRoute kind="objects" lang="kz" />; }
