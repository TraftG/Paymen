import { createClient } from '@supabase/supabase-js'

// DB = tNPnWxdIfnvMI3jC

const SUPABASE_URL = 'https://sdmugkqmapuyqfixkmdz.supabase.co'
const SUPABASE_API_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNkbXVna3FtYXB1eXFmaXhrbWR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE3OTIwNTMsImV4cCI6MjA0NzM2ODA1M30.yMoh3JjGkcYCLA_Ckfl2uDKu3bDxeKkHBIev2LOMU40'

const supabase = createClient(SUPABASE_URL, SUPABASE_API_KEY)


export default supabase
