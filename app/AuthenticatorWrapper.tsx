"use client"

import React from "react";
import { Authenticator } from "@aws-amplify/ui-react";

export default function AuthenticatorWrapper({
  children,
}: {
  children: React.ReactNode;
}): React.ReactNode {
  return <Authenticator>{children}</Authenticator>;
}