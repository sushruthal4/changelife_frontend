export interface DonorActivityItem {
  donorName: string;
  amount: number;
  donatedAt: string;
  cause: string;
}

const FIRST_NAMES = [
  "Aarav",
  "Aanya",
  "Aditya",
  "Ananya",
  "Arjun",
  "Avni",
  "Dev",
  "Diya",
  "Ishan",
  "Ishita",
  "Kabir",
  "Kavya",
  "Krish",
  "Meera",
  "Nikhil",
  "Nisha",
  "Pranav",
  "Priya",
  "Rahul",
  "Riya",
  "Rohan",
  "Saanvi",
  "Sai",
  "Sanjana",
  "Siddharth",
  "Sneha",
  "Varun",
  "Vedika",
  "Vihaan",
  "Zara",
  "Akash",
  "Bhavna",
  "Chetan",
  "Deepika",
  "Gaurav",
  "Harini",
  "Jai",
  "Kiran",
  "Lakshmi",
  "Manish",
  "Neha",
  "Omkar",
  "Pooja",
  "Rakesh",
  "Shreya",
  "Tanvi",
  "Uday",
  "Vaishnavi",
  "Yash",
  "Zoya",
] as const;

const LAST_NAMES = [
  "Sharma",
  "Patel",
  "Reddy",
  "Nair",
  "Menon",
  "Gowda",
  "Singh",
  "Das",
  "Rao",
  "Iyer",
] as const;

const AMOUNTS = [
  101, 251, 501, 751, 1001, 1501, 2001, 2501, 3001, 3501, 5001, 7501, 10001, 12501, 15000,
] as const;

const CAUSES = [
  "Meal Support",
  "Child Education",
  "Medical Care",
  "Animal Feeding",
  "Elderly Support",
  "Emergency Relief",
  "Child Care",
  "Animal Care",
] as const;

export const DONOR_ACTIVITY: DonorActivityItem[] = FIRST_NAMES.flatMap((firstName, firstIndex) =>
  LAST_NAMES.map((lastName, lastIndex) => {
    const index = firstIndex * LAST_NAMES.length + lastIndex;

    return {
      donorName: `${firstName} ${lastName}`,
      amount: AMOUNTS[(firstIndex * 7 + lastIndex * 3) % AMOUNTS.length],
      donatedAt: `${(index % 38) + 2} minutes ago`,
      cause: CAUSES[index % CAUSES.length],
    };
  }),
);

export const mergeDonorActivity = (
  configured: Array<Partial<DonorActivityItem>> = [],
): DonorActivityItem[] => {
  const validConfigured = configured
    .filter(
      (item): item is DonorActivityItem =>
        Boolean(item.donorName?.trim()) &&
        Number.isFinite(Number(item.amount)) &&
        Boolean(item.donatedAt?.trim()),
    )
    .map((item, index) => ({
      donorName: item.donorName.trim(),
      amount: Number(item.amount),
      donatedAt: item.donatedAt.trim(),
      cause: item.cause?.trim() || CAUSES[index % CAUSES.length],
    }));

  return [...validConfigured, ...DONOR_ACTIVITY].slice(0, 500);
};
