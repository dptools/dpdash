export const CONFIGURE_DASHBOARD = 'CONFIGURE_DASHBOARD'

export function setDashboardConfiguration(configuration) {
	return {
		type: CONFIGURE_DASHBOARD,
		configuration
	}
}

function getDashboardConfiguration() {

}