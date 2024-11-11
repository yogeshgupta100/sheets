import React, { ChangeEvent, useEffect } from 'react';
import Sheet from '@/controllers/sheet'
import Navbar from '@/components/common/Navbar';
import { PageProps } from '@/.next/types/app/(app)/[sheetId]/page';

const Page: React.FC<PageProps> = ({
  params
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Navbar />
      <div><Sheet sheetId={params.sheetId} /></div>
    </div>
  );
};

export default Page;
