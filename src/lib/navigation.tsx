'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface RouterContextValue {
  pathname: string;
  push: (href: string) => void;
  replace: (href: string) => void;
  back: () => void;
}

const NavigationContext = createContext<RouterContextValue>({
  pathname: '/',
  push: () => {},
  replace: () => {},
  back: () => {},
});

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const [pathname, setPathname] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const initialPath = window.location.pathname;
      if (initialPath && initialPath !== '/') {
        return initialPath;
      }
    }
    return '/login';
  });

  useEffect(() => {
    const handlePopState = () => {
      setPathname(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const push = useCallback((href: string) => {
    if (typeof window !== 'undefined') {
      try {
        window.history.pushState({}, '', href);
      } catch {
        // Fallback if sandboxed iframe restricts pushState
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setPathname(href);
  }, []);

  const replace = useCallback((href: string) => {
    if (typeof window !== 'undefined') {
      try {
        window.history.replaceState({}, '', href);
      } catch {
        // Fallback
      }
    }
    setPathname(href);
  }, []);

  const back = useCallback(() => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      setPathname('/eventos');
    } else {
      setPathname('/');
    }
  }, []);

  return (
    <NavigationContext.Provider value={{ pathname, push, replace, back }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function usePathname(): string {
  const ctx = useContext(NavigationContext);
  return ctx.pathname;
}

export function useRouter() {
  const ctx = useContext(NavigationContext);
  return {
    push: ctx.push,
    replace: ctx.replace,
    back: ctx.back,
    pathname: ctx.pathname,
  };
}

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
}

export const Link: React.FC<LinkProps> = ({ href, onClick, children, ...rest }) => {
  const { push } = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) {
      onClick(e);
    }
    if (
      !e.defaultPrevented &&
      e.button === 0 &&
      !e.metaKey &&
      !e.ctrlKey &&
      !e.shiftKey &&
      !e.altKey
    ) {
      e.preventDefault();
      push(href);
    }
  };

  return (
    <a href={href} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
};

export default Link;
