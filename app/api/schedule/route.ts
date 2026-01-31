import { NextResponse } from 'next/server';

export async function GET() {
  const schedule = 
  
  {
"Grade 1": {
"Sunday": ["English", "Math", "Social Studies", "Science", "Computer", "Islamic", "Arabic"],
"Monday": ["English", "Math", "Science", "Arabic", "Fine Arts", "Islamic"],
"Tuesday": ["Arabic", "Islamic", "Math", "English", "Science", "Fine Arts", "P.E"],
"Wednesday": ["Arabic", "Islamic", "Math", "English", "Social Studies", "Computer"],
"Thursday": ["P.E", "Arabic", "Life-Skills", "English", "Science"]
},
"Grade 2": {
"Sunday": ["Social Studies", "Arabic", "Science", "English", "Islamic", "Math"],
"Monday": ["English", "Science", "P.E", "Computer", "Arabic", "Islamic", "Math"],
"Tuesday": ["English", "Fine Arts", "Arabic", "Math"],
"Wednesday": ["English", "Fine Arts", "Social Studies", "Islamic", "Arabic", "Science", "Math"],
"Thursday": ["English", "Life-Skills", "Islamic", "Math", "Science", "Arabic", "P.E"]
},
"Grade 3A": {
"Sunday": ["Fine Arts", "Math", "Islamic", "Science", "English", "Life-Skills", "Arabic"],
"Monday": ["Arabic", "Computer", "English", "Islamic", "Math", "Social Studies"],
"Tuesday": ["Arabic", "Math", "English", "Computer", "Islamic", "Science"],
"Wednesday": ["English", "Science", "Islamic", "Math", "P.E", "Fine Arts", "Arabic"],
"Thursday": ["Arabic", "P.E", "Math", "English", "Computer", "Islamic", "Science"]
},
"Grade 7A": {
"Sunday": ["Arabic", "Math", "English", "Science", "French", "Computer", "Islamic"],
"Monday": ["English", "Math", "Social Studies", "English", "Science", "Arabic", "Computer", "Islamic"],
"Tuesday": ["English", "Math", "Islamic", "P.E", "S.S in Arabic", "Arabic", "Life-Skills", "English"],
"Wednesday": ["Math", "English", "English", "Fine Arts", "Islamic", "S.S in Arabic", "English", "Math", "Social Studies", "Science"],
"Thursday": ["Science", "Math", "English", "English"]
},
"Grade 7B": {
"Sunday": ["Fine Arts", "P.E", "Islamic", "English", "Math", "Life-Skills", "Arabic", "Science"],
"Monday": ["Arabic", "Islamic", "English", "Math", "English", "Science", "Social Studies"],
"Tuesday": ["English", "Science", "Arabic", "Islamic", "Math", "P.E"],
"Wednesday": ["English", "English", "Math", "Social Studies", "Arabic", "Science", "Islamic"],
"Thursday": ["English", "English", "Islamic", "Science", "Math", "Computer", "Arabic", "French"]
},
"Grade 7C": {
"Sunday": ["Fine Arts", "Islamic", "English", "Science", "Math", "Computer", "Life-Skills"],
"Monday": ["Arabic", "Islamic", "English", "Math", "P.E", "English", "Science"],
"Tuesday": ["English", "English", "Arabic", "Islamic", "Math", "Science", "French"],
"Wednesday": ["English", "English", "Islamic", "Science", "Arabic", "Math", "Social Studies"],
"Thursday": ["Science", "English", "Arabic", "Islamic", "Math", "English", "S.S in Arabic", "P.E"]
},
"Grade 7G": {
"Sunday": ["Arabic", "Math", "English", "English", "Computer", "P.E", "Islamic", "Science"],
"Monday": ["S.S in Arabic", "Computer", "Social Studies", "Islamic", "Math", "English", "English", "Science"],
"Tuesday": ["English", "Arabic", "Math", "Islamic", "S.S in Arabic", "Science", "French"],
"Wednesday": ["English", "English", "Math", "Arabic", "Islamic", "Science", "Life-Skills", "P.E"],
"Thursday": ["English", "Islamic", "Science", "Math", "Computer", "Arabic", "English", "Fine Arts"]
},
"Grade 8A": {
"Sunday": ["Computer", "Math", "English", "Science", "Arabic", "Islamic", "Social Studies"],
"Monday": ["Arabic", "English", "Fine Arts", "Islamic", "Life-Skills", "Math", "Science"],
"Tuesday": ["English", "Arabic", "Math", "English", "Science", "S.S in Arabic", "French", "P.E"],
"Wednesday": ["English", "English", "Arabic", "Math", "Islamic", "S.S in Arabic", "Science", "Computer"],
"Thursday": ["English", "Islamic", "Science", "Math", "Computer", "Life-Skills", "English", "Fine Arts"]
},
"Grade 8G": {
"Sunday": ["Social Studies", "Islamic", "English", "Science", "Arabic", "Fine Arts", "Math"],
"Monday": ["S.S in Arabic", "P.E", "English", "English", "Arabic", "Math", "Islamic", "Science"],
"Tuesday": ["English", "English", "Arabic", "Math", "Islamic", "Computer", "Science", "French"],
"Wednesday": ["English", "English", "Arabic", "Math", "Islamic", "S.S in Arabic", "Science", "P.E"],
"Thursday": ["English", "Islamic", "Science", "Math", "Computer", "Life-Skills", "English", "Fine Arts"]
},
"Grade 9A": {
"Sunday": ["Arabic", "Computer", "English", "Islamic", "Math", "S.S in Arabic", "Science", "P.E"],
"Monday": ["Arabic", "English", "Fine Arts", "Islamic", "Life-Skills", "Math", "Science"],
"Tuesday": ["English", "French", "Islamic", "P.E", "S.S in Arabic", "Science", "Social Studies"],
"Wednesday": ["Arabic", "English", "Islamic", "Math", "P.E", "Science"],
"Thursday": ["English", "Fine Arts", "French", "Islamic", "Math", "S.S in Arabic", "Science", "Social Studies"]
},
"Grade 9B": {
"Sunday": ["English", "French", "Islamic", "Math", "P.E", "S.S in Arabic", "Science"],
"Monday": ["Arabic", "Computer", "English", "Islamic", "Math", "Science", "Social Studies"],
"Tuesday": ["Arabic", "English", "Fine Arts", "Islamic", "Life-Skills", "Math", "P.E"],
"Wednesday": ["Arabic", "English", "Fine Arts", "Islamic", "Math", "P.E", "Science"],
"Thursday": ["Arabic", "Computer", "English", "Islamic", "Math", "Science", "Social Studies"]
},
"Grade 9C": {
"Sunday": ["Arabic", "English", "Fine Arts", "Islamic", "Math", "Science", "Social Studies"],
"Monday": ["Arabic", "Computer", "Fine Arts", "Islamic", "Math", "S.S in Arabic", "Science"],
"Tuesday": ["Arabic", "Computer", "English", "French", "Islamic", "Math", "Science"],
"Wednesday": ["English", "Islamic", "Math", "S.S in Arabic", "Science", "Social Studies"],
"Thursday": ["Arabic", "English", "Islamic", "Life-Skills", "Math", "P.E", "Science"]
},
"Grade 10A": {
"Sunday": ["Arabic", "Computer", "English", "Islamic", "Math", "P.E", "S.S in Arabic", "Science"],
"Monday": ["Arabic", "English", "Fine Arts", "Islamic", "Life-Skills", "Math", "Science"],
"Tuesday": ["English", "French", "Islamic", "S.S in Arabic", "Science", "Social Studies"],
"Wednesday": ["Arabic", "English", "Fine Arts", "Islamic", "Math", "P.E", "Science"],
"Thursday": ["Arabic", "Computer", "English", "Islamic", "Math", "Science", "Social Studies"]
},
"Grade 10B": {
"Sunday": ["English", "French", "Islamic", "Math", "P.E", "S.S in Arabic", "Science"],
"Monday": ["Arabic", "Computer", "English", "Islamic", "Math", "Science", "Social Studies"],
"Tuesday": ["Arabic", "English", "Fine Arts", "Islamic", "Life-Skills", "Math", "P.E"],
"Wednesday": ["Arabic", "English", "Fine Arts", "Islamic", "Math", "P.E", "Science"],
"Thursday": ["Arabic", "Computer", "English", "Islamic", "Math", "Science", "Social Studies"]
},
"Grade 11A": {
"Sunday": ["Arabic", "English", "Fine Arts", "Islamic", "Life-Skills", "Math", "Science"],
"Monday": ["Arabic", "Computer", "English", "Islamic", "Math", "Science", "Social Studies"],
"Tuesday": ["Arabic", "Computer", "English", "French", "Islamic", "Math", "Science"],
"Wednesday": ["English", "Islamic", "Math", "S.S in Arabic", "Science", "Social Studies"],
"Thursday": ["Arabic", "English", "Islamic", "Life-Skills", "Math", "P.E", "Science"]
},
"Grade 11B": {
"Sunday": ["English", "French", "Islamic", "Math", "P.E", "S.S in Arabic", "Science"],
"Monday": ["Arabic", "Computer", "English", "Islamic", "Math", "Science", "Social Studies"],
"Tuesday": ["Arabic", "English", "Fine Arts", "Islamic", "Life-Skills", "Math", "P.E"],
"Wednesday": ["Arabic", "English", "Fine Arts", "Islamic", "Math", "P.E", "Science"],
"Thursday": ["Arabic", "Computer", "English", "Islamic", "Math", "Science", "Social Studies"]
},
"Grade 11C": {
"Sunday": ["Arabic", "English", "Fine Arts", "Islamic", "Math", "Science", "Social Studies"],
"Monday": ["Arabic", "Computer", "Fine Arts", "Islamic", "Math", "S.S in Arabic", "Science"],
"Tuesday": ["Arabic", "Computer", "English", "French", "Islamic", "Math", "Science"],
"Wednesday": ["English", "Islamic", "Math", "S.S in Arabic", "Science", "Social Studies"],
"Thursday": ["Arabic", "English", "Islamic", "Life-Skills", "Math", "P.E", "Science"]
},
"Grade 12A": {
"Sunday": ["Arabic", "English", "Fine Arts", "Islamic", "Life-Skills", "Math", "Science"],
"Monday": ["Arabic", "Computer", "English", "Islamic", "Math", "Science", "Social Studies"],
"Tuesday": ["Arabic", "Computer", "English", "French", "Islamic", "Math", "Science"],
"Wednesday": ["English", "Islamic", "Math", "S.S in Arabic", "Science", "Social Studies"],
"Thursday": ["Arabic", "English", "Islamic", "Life-Skills", "Math", "P.E", "Science"]
},
"Grade 12B": {
"Sunday": ["Arabic", "English", "Fine Arts", "Islamic", "Life-Skills", "Math", "Science"],
"Monday": ["Arabic", "Computer", "English", "Islamic", "Math", "Science", "Social Studies"],
"Tuesday": ["Arabic", "English", "Fine Arts", "Islamic", "Life-Skills", "Math", "P.E"],
"Wednesday": ["Arabic", "English", "Fine Arts", "Islamic", "Math", "P.E", "Science"],
"Thursday": ["Arabic", "Computer", "English", "Islamic", "Math", "Science", "Social Studies"]
},
"Grade 4A": {
"Sunday": ["Arabic", "Islamic", "Math", "S.S in Arabic", "Computer", "Science", "English", "P.E"],
"Monday": ["Arabic", "Science", "English", "Fine Arts", "Life-Skills", "Islamic", "Math"],
"Tuesday": ["English", "English", "P.E", "Fine Arts", "Arabic", "English", "Islamic", "Math", "Science"],
"Wednesday": ["English", "English", "Islamic", "Science", "English", "Social Studies", "Computer", "Arabic", "Math"],
"Thursday": ["MATH ( IXL )", "French", "S.S in Arabic", "English", "Computer", "Islamic", "Math", "Science", "Social Studies"]
},
"Grade 4B": {
"Sunday": ["French", "English", "English", "S.S in Arabic", "Islamic", "Math", "Science", "P.E"],
"Monday": ["Arabic", "Computer", "English", "Islamic", "Math", "Science", "Social Studies"],
"Tuesday": ["Arabic", "English", "Fine Arts", "Islamic", "Life-Skills", "Math", "P.E"],
"Wednesday": ["Arabic", "English", "Fine Arts", "Islamic", "Math", "P.E", "Science"],
"Thursday": ["Arabic", "Computer", "English", "Islamic", "Math", "Science", "Social Studies"]
},
"Grade 4C": {
"Sunday": ["Arabic", "English", "Fine Arts", "Islamic", "Math", "Science", "Social Studies"],
"Monday": ["Arabic", "Computer", "Fine Arts", "Islamic", "Math", "S.S in Arabic", "Science"],
"Tuesday": ["Arabic", "Computer", "English", "French", "Islamic", "Math", "Science"],
"Wednesday": ["English", "Islamic", "Math", "S.S in Arabic", "Science", "Social Studies"],
"Thursday": ["Arabic", "English", "Islamic", "Life-Skills", "Math", "P.E", "Science"]
},
"Grade 5A": {
"Sunday": ["Islamic", "P.E", "Science", "Fine Arts", "Arabic", "S.S in Arabic", "English", "Math"],
"Monday": ["Arabic", "English", "Islamic", "Math", "P.E", "Science", "Social Studies"],
"Tuesday": ["Arabic", "Computer", "English", "Islamic", "Math", "Science", "French"],
"Wednesday": ["English", "Islamic", "Math", "S.S in Arabic", "Science", "Social Studies"],
"Thursday": ["Arabic", "English", "Islamic", "Life-Skills", "Math", "P.E", "Science"]
},
"Grade 5B": {
"Sunday": ["Arabic", "P.E", "English", "Fine Arts", "Islamic", "Math", "Science", "Social Studies"],
"Monday": ["Arabic", "Computer", "English", "Islamic", "Math", "Science", "Social Studies"],
"Tuesday": ["Arabic", "English", "Fine Arts", "Islamic", "Life-Skills", "Math", "P.E"],
"Wednesday": ["Arabic", "English", "Fine Arts", "Islamic", "Math", "P.E", "Science"],
"Thursday": ["Arabic", "Computer", "English", "Islamic", "Math", "Science", "Social Studies"]
},
"Grade 5C": {
"Sunday": ["Arabic", "Islamic", "Science", "S.S in Arabic", "Computer", "Math", "English", "P.E"],
"Monday": ["Arabic", "P.E", "English", "Fine Arts", "S.S in Arabic", "Islamic", "Science", "Math"],
"Tuesday": ["Computer", "Arabic", "English", "French", "Fine Arts", "Social Studies", "Islamic", "Math"],
"Wednesday": ["English", "Arabic", "Islamic", "Math", "English", "Science", "S.S in Arabic", "P.E"],
"Thursday": ["English", "Islamic", "Math", "Arabic", "Science", "Life-Skills", "French", "Social Studies"]
},
"Grade 6A": {
"Sunday": ["French", "Fine Arts", "English", "Life-Skills", "Arabic", "Islamic", "Math", "Science"],
"Monday": ["Arabic", "English", "Islamic", "Math", "S.S in Arabic", "Science", "Social Studies"],
"Tuesday": ["English", "Arabic", "Islamic", "Math", "S.S in Arabic", "Science", "P.E"],
"Wednesday": ["English", "Islamic", "Math", "Arabic", "Science", "P.E", "Computer", "Fine Arts"],
"Thursday": ["S.S in Arabic", "Math", "Science", "Arabic", "Islamic", "English", "Computer", "English"]
},
"Grade 6B": {
"Sunday": ["Islamic", "Science", "French", "Arabic", "P.E", "English", "Math"],
"Monday": ["S.S in Arabic", "Social Studies", "Math", "Fine Arts", "Arabic", "Islamic", "Science", "P.E"],
"Tuesday": ["English", "Islamic", "Math", "French", "Computer", "Arabic", "Science"],
"Wednesday": ["English", "Arabic", "Islamic", "Math", "S.S in Arabic", "Science", "Life-Skills", "P.E"],
"Thursday": ["English", "Arabic", "Islamic", "Science", "Math", "Computer", "English", "Fine Arts"]
},
"Grade 6C": {
"Sunday": ["S.S in Arabic", "Social Studies", "Math", "Arabic", "Islamic", "Science", "English"],
"Monday": ["Arabic", "Islamic", "English", "Math", "P.E", "English", "Science"],
"Tuesday": ["English", "Arabic", "Math", "Islamic", "S.S in Arabic", "Science", "French"],
"Wednesday": ["English", "Arabic", "Islamic", "Math", "P.E", "Science", "Social Studies"],
"Thursday": ["Arabic", "English", "Islamic", "Life-Skills", "Math", "P.E", "Science"]
},
"Grade 6G": {
"Sunday": ["Islamic", "English", "Science", "Arabic", "P.E", "Math", "Fine Arts"],
"Monday": ["Arabic", "English", "P.E", "Computer", "Arabic", "Islamic", "Math", "Science"],
"Tuesday": ["English", "Arabic", "Math", "Islamic", "S.S in Arabic", "Science", "French"],
"Wednesday": ["English", "Arabic", "Islamic", "Math", "P.E", "Science", "Life-Skills"],
"Thursday": ["Arabic", "English", "Islamic", "Science", "Math", "Computer", "English", "Fine Arts"]
}
};
  return NextResponse.json(schedule);
}