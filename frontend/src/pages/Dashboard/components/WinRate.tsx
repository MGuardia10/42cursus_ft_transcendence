import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';
import { useLanguage } from '@/hooks/useLanguage';
import { useMediaQuery } from '@mui/material';

const WinRate: React.FC = () => {

	// useLanguage hook
	const { t } = useLanguage();

	// useMediaQuery hook
	const isMobile = useMediaQuery('(max-width: 768px)');
	const isMonitor = useMediaQuery('(max-width: 1536px)');

	const width = isMonitor ? (isMobile ? 250 : 300) : 350;
	const height = isMonitor ? (isMobile ? 125 : 150) : 175;

	return (
		<div className="flex flex-col items-center justify-center gap-6 w-full p-6 md:p-10">
			<PieChart
				colors={['#4ACEAB', '#6a6fc3']}
				series={[
					{
					data: [
						{ value: 75, label: `${ t("dashboard_wins") }` },
						{ value: 25, label: `${ t("dashboard_losses") }` },
					  ],
					highlightScope: { fade: 'global', highlight: 'item' },
					faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
					innerRadius: isMonitor ? (isMobile ? 20 : 30) : 40,
					paddingAngle: 5,
					startAngle: -180,
					arcLabel: (item) => `${item.value}%`,
				}
				]}
				sx={{
					[`& .${pieArcLabelClasses.root}`]: {
					  fill: 'white',
					  stroke: 'none',
					  fontSize: 14,
					  fontWeight: 'bold'
					},
					[`& .${pieArcLabelClasses.highlighted}`]: {
					  fill: 'white'

					},
					[`& .${pieArcLabelClasses.faded}`]: {
					  fill: 'none'
					}
				  }}
				slotProps={{
					legend: {
						hidden: false,
						labelStyle: {
							fontSize: isMobile ? 14 : 16,
							fill: 'white'
						  },
					}
				}}
				width={width}
  				height={height}
			/>
		</div>
	);
};

export default WinRate;