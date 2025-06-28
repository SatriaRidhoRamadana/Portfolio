import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Article {
  id: number;
  title: string;
  summary: string;
  content: string;
  image?: string;
  createdAt: number;
}

export default function ArticlesSection() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [selected, setSelected] = useState<Article | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetch("/api/articles")
      .then((res) => res.json())
      .then(setArticles);
  }, []);

  const isArray = Array.isArray(articles);

  return (
    <section id="articles" className="py-20 bg-slate-900/60 relative z-10">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="orbitron text-3xl font-bold text-pink-500 mb-8 text-center">Articles</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {isArray ? articles.map((article) => (
            <div key={article.id} className="bg-slate-800/80 rounded-lg p-6 shadow-lg flex flex-col">
              {article.image && (
                <img src={article.image} alt={article.title} className="mb-4 rounded-md max-h-48 object-cover w-full" />
              )}
              <h3 className="text-xl font-semibold mb-2 text-white">{article.title}</h3>
              <p className="text-slate-300 mb-4 line-clamp-3">{article.summary}</p>
              <div className="mt-auto">
                <Button onClick={() => { setSelected(article); setOpen(true); }} className="cosmic-btn">Read More</Button>
              </div>
            </div>
          )) : (
            <div className="text-red-500 col-span-2">Failed to load articles.</div>
          )}
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-pink-500">{selected?.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {selected?.image && (
                <div className="flex justify-center">
                  <img 
                    src={selected.image} 
                    alt={selected.title} 
                    className="rounded-md max-h-48 max-w-full object-contain" 
                  />
                </div>
              )}
              <div className="text-slate-200 whitespace-pre-line max-h-96 overflow-y-auto pr-2">
                {selected?.content}
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setOpen(false)} className="cosmic-btn">
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
} 