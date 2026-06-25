import fs from "fs";
import path from "path";



// ===== .mdx Data ===== \\
export interface MdxData {
  slug: string;
  frontmatter: Record<string, any>;
  content: string;
}



// ===== Content Folder Path ===== \\
const CONTENT_PATH = path.join(process.cwd(), 'content');



// ===== Formatter ===== \\
export function parseFrontmatter(fileContent: string) {
  const match = fileContent.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) {
    return { frontmatter: {}, content: fileContent };
  }

  const yamlBlock = match[1];
  const content = fileContent.slice(match[0].length).trim();
  const frontmatter: Record<string, any> = {};

  yamlBlock.split('\n').forEach(line => {
    const cleanLine = line.trim();
    if (!cleanLine || cleanLine.startsWith('#')) return;

    const colonIdx = cleanLine.indexOf(':');
    if (colonIdx !== -1) {
      const key = cleanLine.substring(0, colonIdx).trim();
      let val = cleanLine.substring(colonIdx + 1).trim();
      
      val = val.replace(/^['"]|['"]$/g, '');
      
      frontmatter[key] = val;
    }
  });

  return { frontmatter, content };
}



// ===== MDX Reader for one file ===== \\
export async function getMdxBySlug(folder: string, slug: string): Promise<MdxData | null> {
  try {
    const filePath = folder 
      ? path.join(CONTENT_PATH, folder, `${slug}.mdx`)
      : path.join(CONTENT_PATH, `${slug}.mdx`);

    if (!fs.existsSync(filePath)) {
      return null;
    }

    const rawContent = await fs.promises.readFile(filePath, "utf-8");
    const { frontmatter, content } = parseFrontmatter(rawContent);

    return {
      slug,
      frontmatter,
      content,
    };
  } catch (error) {
    console.error(`Error reading MDX file for folder: ${folder}, slug: ${slug}`, error);
    return null;
  }
}



// ===== MDX Reader for a whole folder ===== \\
export async function getAllMdx(folder: string): Promise<MdxData[]> {
  try {
    const dirPath = path.join(CONTENT_PATH, folder);
    if (!fs.existsSync(dirPath)) {
      return [];
    }

    const files = await fs.promises.readdir(dirPath);
    const mdxFiles = files.filter(file => file.endsWith('.mdx'));

    const items = await Promise.all(
      mdxFiles.map(async (file) => {
        const slug = file.replace(/\.mdx$/, '');
        const data = await getMdxBySlug(folder, slug);
        return data;
      })
    );

    const validItems = items.filter((item): item is MdxData => item !== null);

    return validItems.sort((a, b) => {
      const dateA = a.frontmatter.date ? new Date(a.frontmatter.date).getTime() : 0;
      const dateB = b.frontmatter.date ? new Date(b.frontmatter.date).getTime() : 0;
      return dateB - dateA;
    });
  } 
  catch (error) {
    console.error(`Error listing MDX files in folder: ${folder}`, error);
    return [];
  }
}