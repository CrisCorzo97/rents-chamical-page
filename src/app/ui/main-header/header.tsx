import { LogoRents } from '@/assets/icons';
import { Button } from '@/components/ui/button';
import {
  ListItem,
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import Link from 'next/link';

export type NavbarMenuItems = {
  key: string;
  href: string;
  label: string;
  subItems?: NavbarMenuItems[];
};

export const MainHeader = () => {
  const items: NavbarMenuItems[] = [
    {
      label: 'Organismo',
      key: 'organism',
      href: '/organismo',
      subItems: [
        {
          label: 'Sobre Rentas',
          key: 'about',
          href: '/sobre-rentas',
        },
        {
          label: 'Autoridades',
          key: 'authorities',
          href: '/autoridades',
        },
        {
          label: 'Visión y Misión',
          key: 'vision-mision',
          href: '/vision-y-mision',
        },
        { label: 'Funciones', key: 'functions', href: '/funciones' },
      ],
    },
    {
      label: 'Trámites',
      key: 'formalities',
      href: '/tramites',
      subItems: [
        { label: 'Consultas', key: 'queries', href: '/consultas' },
        {
          label: 'DDJJ Actividad Comercial',
          key: 'commercial-activity-affidavits',
          href: '/DDJJ-actividad-comercial',
        },
        {
          label: 'Generar Oblea',
          key: 'generate-sticker',
          href: '/oblea/generar',
        },
      ],
    },
    {
      label: 'Información',
      key: 'information',
      href: '/informacion',
      subItems: [
        {
          label: 'Tasas / Contribuciones',
          key: 'taxes',
          href: '/tasas-contribuciones',
        },
        {
          label: 'Información fiscal',
          key: 'fiscal-info',
          href: '/informacion-fiscal',
          subItems: [
            { label: 'Leyes', key: 'laws', href: '#' },
            { label: 'Decretos', key: 'decrees', href: '#' },
            { label: 'Resoluciones', key: 'resolutions', href: '#' },
            { label: 'Ordenanzas', key: 'ordinances', href: '#' },
          ],
        },
        { label: 'Novedades', key: 'news', href: '/novedades' },
      ],
    },
    {
      label: 'Centro de Ayuda',
      key: 'help-center',
      href: '/centro-de-ayuda',
      subItems: [
        { label: 'Contacto', key: 'contact', href: '/contacto' },
        {
          label: 'Preguntas Frecuentes',
          key: 'faq',
          href: '/preguntas-frecuentes',
        },
        {
          label: 'Instructivos / Tutoriales',
          key: 'tutorials',
          href: '/instructivos-tutoriales',
        },
      ],
    },
  ];

  return (
    <header className='w-full h-20 flex grow-0 items-center justify-center bg-primary'>
      <section className='max-w-6xl w-full flex items-center justify-between px-4'>
        <div className='flex gap-2'>
          <LogoRents className='h-12 w-auto md:h-16' fill='#fff' />
        </div>

        {/* Desktop Navigation */}
        <div className='hidden md:block'>
          <NavigationMenu>
            <NavigationMenuList>
              {items.map((item) => (
                <NavigationMenuItem key={item.key}>
                  {item.subItems ? (
                    <>
                      <Link href={item.href} prefetch passHref>
                        <NavigationMenuTrigger
                          className={navigationMenuTriggerStyle({
                            className:
                              'bg-primary text-primary-foreground hover:bg-primary/90',
                          })}
                        >
                          {item.label}
                        </NavigationMenuTrigger>
                      </Link>
                      <NavigationMenuContent>
                        {item.subItems.map((subItem) => (
                          <ul
                            key={subItem.key}
                            className='grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]'
                          >
                            <ListItem
                              key={subItem.key}
                              title={subItem.label}
                              href={`${item.href}${subItem.href}`}
                            >
                              {subItem.subItems ? (
                                <div className='flex flex-col'>
                                  {subItem.subItems.map((subSubItem) => (
                                    <span key={subSubItem.key}>
                                      {subSubItem.label}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <></>
                              )}
                            </ListItem>
                          </ul>
                        ))}
                      </NavigationMenuContent>
                    </>
                  ) : (
                    <Link href={item.href} prefetch passHref>
                      <NavigationMenuLink
                        className={navigationMenuTriggerStyle({
                          className:
                            'bg-primary text-primary-foreground hover:bg-primary/90',
                        })}
                      >
                        {item.label}
                      </NavigationMenuLink>
                    </Link>
                  )}
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Mobile Navigation */}
        <div className='md:hidden'>
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant='ghost'
                size='icon'
                className='text-white hover:bg-primary/90'
              >
                <Menu className='h-6 w-6' />
              </Button>
            </SheetTrigger>
            <SheetContent side='right' className='w-full bg-primary text-white'>
              <SheetTitle className='text-white'>
                <LogoRents className='h-12 w-auto md:h-16' fill='#fff' />
              </SheetTitle>
              <SheetDescription className='text-white'></SheetDescription>
              <nav className='flex flex-col gap-4 mt-8'>
                {items.map((item) => (
                  <div key={item.key}>
                    {item.subItems ? (
                      <div className='flex flex-col gap-2'>
                        <Link href={item.href} className='text-lg font-medium'>
                          {item.label}
                        </Link>
                        <div className='flex flex-col gap-2 pl-4'>
                          {item.subItems.map((subItem) => (
                            <Link
                              key={subItem.key}
                              href={`${item.href}${subItem.href}`}
                              className='text-base hover:text-primary-foreground/80'
                            >
                              {subItem.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <Link
                        href={item.href}
                        className='text-lg font-medium hover:text-primary-foreground/80'
                      >
                        {item.label}
                      </Link>
                    )}
                  </div>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </section>
    </header>
  );
};
