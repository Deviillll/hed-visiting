import { Terminal } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// Mock employees data for search
const mockEmployees = [
	{ id: "1", name: "John Smith", personnelCode: "EMP001" },
	{ id: "2", name: "Sarah Johnson", personnelCode: "EMP002" },
	{ id: "3", name: "Michael Brown", personnelCode: "EMP003" },
	{ id: "4", name: "Emily Davis", personnelCode: "EMP004" },
	{ id: "5", name: "David Wilson", personnelCode: "EMP005" },
	{ id: "6", name: "Lisa Anderson", personnelCode: "EMP006" },
	{ id: "7", name: "James Taylor", personnelCode: "EMP007" },
	{ id: "8", name: "Jessica White", personnelCode: "EMP008" },
	{ id: "9", name: "Robert Miller", personnelCode: "EMP009" },
	{ id: "10", name: "Mary Martinez", personnelCode: "EMP010" },
	{ id: "11", name: "Thomas Moore", personnelCode: "EMP011" },
	{ id: "12", name: "Jennifer Lee", personnelCode: "EMP012" },
	{ id: "13", name: "William Clark", personnelCode: "EMP013" },
	{ id: "14", name: "Patricia Hall", personnelCode: "EMP014" },
	{ id: "15", name: "Richard King", personnelCode: "EMP015" },
	{ id: "16", name: "Susan Wright", personnelCode: "EMP016" },
	{ id: "17", name: "Joseph Hill", personnelCode: "EMP017" },
	{ id: "18", name: "Nancy Baker", personnelCode: "EMP018" },
	{ id: "19", name: "Daniel Green", personnelCode: "EMP019" },
	{ id: "20", name: "Karen Young", personnelCode: "EMP020" },
	{ id: "21", name: "Kevin Turner", personnelCode: "EMP021" },
	{ id: "22", name: "Laura Harris", personnelCode: "EMP022" },
	{ id: "23", name: "Steven Adams", personnelCode: "EMP023" },
	{ id: "24", name: "Margaret Scott", personnelCode: "EMP024" },
	{ id: "25", name: "Charles Wilson", personnelCode: "EMP025" },
	{ id: "26", name: "Betty Thompson", personnelCode: "EMP026" },
	{ id: "27", name: "Mark Rodriguez", personnelCode: "EMP027" },
	{ id: "28", name: "Sandra Lewis", personnelCode: "EMP028" },
	{ id: "29", name: "Paul Walker", personnelCode: "EMP029" },
	{ id: "30", name: "Helen Martin", personnelCode: "EMP030" },
	{ id: "31", name: "George Davis", personnelCode: "EMP031" },
	{ id: "32", name: "Ruth Campbell", personnelCode: "EMP032" },
	{ id: "33", name: "Donald Evans", personnelCode: "EMP033" },
	{ id: "34", name: "Michelle Brown", personnelCode: "EMP034" },
	{ id: "35", name: "Edward Morris", personnelCode: "EMP035" },
	{ id: "36", name: "Carol White", personnelCode: "EMP036" },
	{ id: "37", name: "Jason Parker", personnelCode: "EMP037" },
	{ id: "38", name: "Rachel Cooper", personnelCode: "EMP038" },
	{ id: "39", name: "Kenneth Wood", personnelCode: "EMP039" },
	{ id: "40", name: "Sharon Ross", personnelCode: "EMP040" },
	{ id: "41", name: "Ryan Butler", personnelCode: "EMP041" },
	{ id: "42", name: "Diane Hughes", personnelCode: "EMP042" },
	{ id: "43", name: "Gary Price", personnelCode: "EMP043" },
	{ id: "44", name: "Alice Morgan", personnelCode: "EMP044" },
];

const Page = () => {
	return (
		<div className="container mx-auto p-6 max-w-xlg">
			<Alert>
				<Terminal className="h-4 w-4" />
				<AlertTitle>Heads up!</AlertTitle>
				<AlertDescription>
					You can add components to your app using the cli.
				</AlertDescription>
			</Alert>
		</div>
	);
};

export default Page;
