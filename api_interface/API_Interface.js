const axios = require('axios');

const AxiosConfigured = () => {
    // Indicate to the API that all requests for this app are AJAX
    axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

    // Set the baseURL for all requests to the API domain instead of the current domain
    axios.defaults.baseURL = `http://localhost:8065/api/v1`;

    // Allow browser to send cookies to the API domain (which include auth_token)
    axios.defaults.withCredentials = true;


    // axios.defaults.headers.common['X-CSRF-TOKEN'] = csrf_token;

    return axios;
};


const axiosAgent = AxiosConfigured();

module.exports = class APIInterface {
    async getTrackPaths() {
        console.log("We getting it boys");
        return axiosAgent.get(`metadata/track/paths`)
            // .then(artists => artists.data)
            .then(trackPaths => trackPaths)
            .catch(error => (
                {
                    error,
                    trackPaths: undefined,
                }
            ));
    }
}
