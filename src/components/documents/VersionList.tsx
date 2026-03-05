"use client";

import type { DocumentVersionRecord } from "@/types/documents";

interface VersionListProps {
	versions: DocumentVersionRecord[];
}

export default function VersionList({ versions }: VersionListProps) {
	if (!versions.length) {
		return (
			<p className="text-secondary">
				No hay versiones todavía para este documento.
			</p>
		);
	}

	return (
		<ul className="space-y-3">
			{versions.map((version) => (
				<li key={version.id} className="bg-white rounded-2xl border p-4">
					<div className="flex flex-wrap gap-3 items-center justify-between">
						<div>
							<p className="font-semibold">Versión {version.version_number}</p>
							<p className="text-sm text-secondary">
								{new Date(version.created_at).toLocaleString()}
							</p>
						</div>
						<span className="text-xs rounded-full px-3 py-1 border">
							{version.status} · {version.engine}
						</span>
					</div>
					<div className="mt-2 text-sm text-secondary">
						<p>Origen: {version.source}</p>
						{version.fallback_reason && <p>Fallback: {version.fallback_reason}</p>}
					</div>
					<div className="mt-3">
						<a
							href={version.pdf_url}
							target="_blank"
							rel="noreferrer"
							className="text-primary font-medium hover:underline"
						>
							Abrir PDF de esta versión
						</a>
					</div>
				</li>
			))}
		</ul>
	);
}
