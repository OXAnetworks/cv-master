"use client"

import { createClient } from '@/utils/supabase/client';
import React, { useEffect } from 'react'

export default function User() {
    const supabase = createClient();

    useEffect(() => {
        const fetchUser = async () => {
            const user = await supabase.auth.getUser();
            console.log(user);
        }

        fetchUser();
    }, [])

  return (
    <div>User</div>
  )
}
