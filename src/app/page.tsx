import Folder from "@/components/Folder";
import NewFolder from "@/components/NewFolder";

export default function Home() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
      <NewFolder />
    </div>
  );
}
