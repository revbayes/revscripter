
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	type MatcherParam<M> = M extends (param : string) => param is (infer U extends string) ? U : string;

	export interface AppTypes {
		RouteId(): "/" | "/clock_model" | "/data" | "/mcmc" | "/priors" | "/substitution_model" | "/taxa";
		RouteParams(): {
			
		};
		LayoutParams(): {
			"/": Record<string, never>;
			"/clock_model": Record<string, never>;
			"/data": Record<string, never>;
			"/mcmc": Record<string, never>;
			"/priors": Record<string, never>;
			"/substitution_model": Record<string, never>;
			"/taxa": Record<string, never>
		};
		Pathname(): "/" | "/clock_model" | "/data" | "/mcmc" | "/priors" | "/substitution_model" | "/taxa";
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/robots.txt" | string & {};
	}
}