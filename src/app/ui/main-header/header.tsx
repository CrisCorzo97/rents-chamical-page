import { LogoRents } from '@/assets/icons';
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
      <section className='max-w-6xl w-full flex items-center justify-between'>
        <div className='flex gap-2'>
          <LogoRents height={60} fill='#fff' />
        </div>

        <NavigationMenu>
          <NavigationMenuList>
            {items.map((item) => (
              <NavigationMenuItem key={item.key}>
                {item.subItems ? (
                  <>
                    <Link href={item.href} prefetch legacyBehavior passHref>
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
                  <Link href={item.href} prefetch legacyBehavior passHref>
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
      </section>
    </header>
  );
};
