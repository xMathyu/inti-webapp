"use client";

import { useState } from "react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

type UserMenuProps = {
  userDisplayName?: string;
  isAdmin: boolean;
  handleSignOut: () => void;
  mobile?: boolean;
};

export function UserMenu({
  userDisplayName,
  isAdmin,
  handleSignOut,
  mobile,
}: UserMenuProps) {
  const commonLinks = (
    <>
      <Link
        href="/account"
        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
      >
        Il mio account
      </Link>
      <Link
        href="/my-entries"
        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
      >
        Le mie voci
      </Link>
      {isAdmin && (
        <>
          <Link
            href="/admin/schedules"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            Admin - Schedules
          </Link>
          <Link
            href="/admin/visit-types"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            Admin - Visit Types
          </Link>
        </>
      )}
      <button
        onClick={handleSignOut}
        className="w-full text-left px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 transition duration-150 ease-in-out"
      >
        Esci
      </button>
    </>
  );

  // Se llama siempre a useState, pero solo se usará cuando mobile sea true.
  const [open, setOpen] = useState(false);

  if (!mobile) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="bg-transparent text-white border-white hover:bg-green-500/20"
          >
            {userDisplayName ? `Ciao, ${userDisplayName}` : "Il tuo account"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-white shadow-lg rounded-md py-2 w-48">
          {commonLinks}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div className="w-full">
      <Button
        onClick={() => setOpen(!open)}
        variant="outline"
        className="bg-transparent text-green-700 border-green-700 hover:bg-green-50 w-full"
      >
        {userDisplayName ? `Ciao, ${userDisplayName}` : "Il tuo account"}
      </Button>
      {open && (
        <div className="w-full bg-white shadow-lg rounded-md py-2 text-center">
          {commonLinks}
        </div>
      )}
    </div>
  );
}
