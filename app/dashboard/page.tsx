import { ExternalLink, Link2 } from "lucide-react";
import { getUserLinks } from "@/data/links";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty";
import { CreateLinkDialog } from "./create-link-dialog";
import { EditLinkDialog } from "./edit-link-dialog";
import { DeleteLinkDialog } from "./delete-link-dialog";

export default async function DashboardPage() {
  const links = await getUserLinks();

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-10 sm:px-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            Your links
          </h1>
          <p className="text-sm text-muted-foreground">
            {links.length === 0
              ? "You haven't created any links yet."
              : `${links.length} ${links.length === 1 ? "link" : "links"} created`}
          </p>
        </div>
        <CreateLinkDialog />
      </div>

      <div className="mt-8">
        {links.length === 0 ? (
          <Empty className="border border-dashed border-white/10">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Link2 />
              </EmptyMedia>
              <EmptyTitle>No links yet</EmptyTitle>
              <EmptyDescription>
                Short links you create will show up here.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <ul className="flex flex-col gap-3">
            {links.map((link) => (
              <li key={link.id}>
                <Card>
                  <CardHeader>
                    <CardTitle>
                      <Badge variant="secondary">/{link.shortCode}</Badge>
                    </CardTitle>
                    <CardDescription className="truncate" title={link.url}>
                      {link.url}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex items-center justify-between gap-4 text-xs text-muted-foreground">
                    <span>
                      Created{" "}
                      {link.createdAt.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    <div className="flex items-center gap-1">
                      <EditLinkDialog link={link} />
                      <DeleteLinkDialog link={link} />
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 inline-flex items-center gap-1 hover:text-foreground"
                      >
                        Visit <ExternalLink className="size-3.5" />
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
