export const aliasToExampleKey: Record<string, string> = {
  Arabic: 'اللغة العربية',
  Islamic: 'الدراسات الإسلامية',
  'Social Arabic': 'الدراسات الاجتماعية باللغة العربية',
  ICT: 'Computer',
  LifeSkills: 'Life Skills',
  'Life Skills': 'Life Skills',
};

export const canonicalKey = (dbName: string): string => aliasToExampleKey[dbName] || dbName;