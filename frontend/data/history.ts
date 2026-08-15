export interface HistoryEntry {
  id: string;
  title: string;
  date: string;
  overallResult: string;
  score: number;
  status: "Completed" | "Processing" | "Failed";
}

export const mockHistory: HistoryEntry[] = [
  {
    id: "hist_1",
    title: "Stanford Personal Statement Draft 2",
    date: "2024-10-15T14:30:00Z",
    overallResult: "Likely Human",
    score: 92,
    status: "Completed",
  },
  {
    id: "hist_2",
    title: "Common App Essay - Final",
    date: "2024-10-12T09:15:00Z",
    overallResult: "Mixed",
    score: 79,
    status: "Completed",
  },
  {
    id: "hist_3",
    title: "MIT Supplemental Essay",
    date: "2024-10-10T18:45:00Z",
    overallResult: "Likely AI Assisted",
    score: 45,
    status: "Completed",
  },
  {
    id: "hist_4",
    title: "UC PIQ 1 - Leadership",
    date: "2024-10-09T11:20:00Z",
    overallResult: "Likely Human",
    score: 88,
    status: "Completed",
  },
  {
    id: "hist_5",
    title: "Harvard Supplement (Draft)",
    date: "2024-10-08T16:05:00Z",
    overallResult: "Pending",
    score: 0,
    status: "Processing",
  },
  {
    id: "hist_6",
    title: "Columbia Why Us",
    date: "2024-10-05T20:10:00Z",
    overallResult: "Likely Human",
    score: 95,
    status: "Completed",
  },
  {
    id: "hist_7",
    title: "Yale Short Takes",
    date: "2024-10-01T08:30:00Z",
    overallResult: "Likely AI Assisted",
    score: 30,
    status: "Completed",
  }
];
