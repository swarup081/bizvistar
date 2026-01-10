'use server';

export async function getSupportConfig() {
  return {
    contactFounder: process.env.CONTACT_FOUNDER 
  };
}
