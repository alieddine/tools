import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

import ThemeToggle from './ThemeToggle';
import { Link } from 'react-router-dom';
import "../../index.css";

const components: { title: string; href: string; description: string }[] = [
  {
    title: "JSON",
    href: "/formate/json",
    description:
      "Formats JSON data to be more readable with proper indentation, syntax highlighting, and error detection. Supports minifying or prettifying and validating against JSON standards.",
  },
  {
    title: "XML",
    href: "/formate/xml",
    description:
      "Formats and beautifies XML with indentation and tag alignment. Helps detect unclosed tags and supports collapsing/expanding node trees for easier navigation.",
  },
  {
    title: "YAML",
    href: "/formate/yaml",
    description:
      "Cleans and organizes YAML data with consistent spacing and indentation. Includes validation to detect structural or formatting issues.",
  },
  {
    title: "CSV",
    href: "/formate/csv",
    description:
      "Formats CSV data into aligned columns for easier reading. Converts data to and from other formats like JSON or Excel-compatible tables.",
  },
  {
    title: "HTML",
    href: "/formate/html",
    description:
      "Beautifies and structures HTML with proper indentation. Helps remove unnecessary whitespace and detects unclosed tags or invalid nesting.",
  },
  {
    title: "SQL",
    href: "/formate/sql",
    description:
      "Formats SQL queries with proper indentation and keyword highlighting for improved readability. Supports formatting for different SQL dialects (MySQL, PostgreSQL, etc.).",
  },
];


function NavBar() {

  return (
    <div className="bg-navbar-background z-50 w-full h-[6dvh] mb-2 flex items-center justify-between px-4 shadow-custom ">
      <div className="text-text text-lg font-bold">
        Tools
      </div>
      <NavigationMenu viewport={false}>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Home</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid z-50 text-text gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                <li className="row-span-3 z-50">
                  <NavigationMenuLink asChild>
                    <a
                      className="from-muted/50 z-50 to-muted flex h-full w-full flex-col justify-end rounded-md bg-linear-to-b p-6 no-underline outline-hidden select-none focus:shadow-md"
                      href="/"
                    >
                      <div className="mt-4 mb-2 z-50 text-lg font-medium">
                        shadcn/ui
                      </div>
                      <p className="text-muted-foreground z-50 text-sm leading-tight">
                        Beautifully designed components built with Tailwind CSS.
                      </p>
                    </a>
                  </NavigationMenuLink>
                </li>
                <ListItem href="/docs" title="Introduction">
                  Re-usable components built using Radix UI and Tailwind CSS.
                </ListItem>
                <ListItem href="/docs/installation" title="Installation">
                  How to install dependencies and structure your app.
                </ListItem>
                <ListItem href="/docs/primitives/typography" title="Typography">
                  Styles for headings, paragraphs, lists...etc
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Formate file</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid text-text w-[400px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                {components.map((component) => (
                  <ListItem
                    key={component.title}
                    title={component.title}
                    href={component.href}
                  >
                    {component.description}
                  </ListItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
              <Link to="/docs">Docs</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuTrigger>Colors</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid text-text w-[200px] gap-4">
                <li>
                  <NavigationMenuLink asChild>
                    <Link to="/colors/picker ">Color picker</Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link to="#">Color converter</Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link to="#">Color palette generator</Link>
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuTrigger>Text</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid text-text w-[200px] gap-4">
                <li>
                  <NavigationMenuLink asChild>
                    <Link to="/text/convert">
                      <div className="  leading-none font-medium">Convert Case</div>
                      <p className="text-text-secondary line-clamp-2  leading-snug">
                        Convert text to different cases like uppercase, lowercase, title case, etc.
                      </p>
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link to="/text/OCR">
                      <div className="  leading-none font-medium">OCR</div>
                      <p className="text-text-secondary line-clamp-2  leading-snug">
                        Optical Character Recognition tool to extract text from images.
                      </p>
                    </Link>
                  </NavigationMenuLink>
               
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

        </NavigationMenuList>
      </NavigationMenu>

      <ThemeToggle />
    </div>
  )
}

function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link to={href}>
          <div className="text-sm leading-none font-medium">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  )
}


export default NavBar;