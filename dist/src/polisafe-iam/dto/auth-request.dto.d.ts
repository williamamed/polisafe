export declare class AuthRequestDto {
    response_type: 'code' | 'token';
    client_id: string;
    redirect_uri?: string;
    scope?: string;
    state?: string;
    code_challenge?: string;
    code_challenge_method?: string;
    nonce: string;
    display: string;
    prompt: string;
    max_age: string;
    ui_locales: string;
    claims_locales: string;
    id_token_hint: string;
    login_hint: string;
    acr_values: string;
    tenant: string;
}
