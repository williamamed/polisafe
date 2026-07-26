export interface ISettings {
    login_name?: string;
    login_description?: string;
    login_icon_url?: string;
    login_button_next_name?: string;
    login_register_url?: string;
    login_button_register_name?: string;
    login_css_url?: string;
    login_google_provider?: boolean;
    login_google_client_id?: string;
    login_google_client_secret?: string;
    login_linkedin_provider?: boolean;
    login_linkedin_client_id?: string;
    login_linkedin_client_secret?: string;
    login_facebook_provider?: boolean;
    login_facebook_client_id?: string;
    login_facebook_client_secret?: string;
    login_github_provider?: boolean;
    login_github_client_id?: string;
    login_github_client_secret?: string;
    register_name?: string;
    register_description?: string;
    register_icon_url?: string;
    register_button_name?: string;
    [key: string]: string | number | string[] | any;
}
