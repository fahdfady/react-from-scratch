export type HookType = | 'useState' | "useEffect" | "useSignal";
export type Dispatcher = {
    useState<S>(initialState: (() => S) | S): [S, (s: S) => void];
}

export function useState<T>(initialValue: T): [value: T, setValue: (value: T) => void] {
    const dispatcher = resolveDispatcher();
    return dispatcher.useState(initialValue)
}

function resolveDispatcher() {
    const dispatcher = {
        useState: <S>(initialState: (() => S) | S): [S, (s: S) => void] => {
            let state = typeof initialState === 'function' ? (initialState as () => S)() : initialState;
            const setState = (newState: S) => {
                console.log("***  NEW STATE PASSED:  ", newState, "  ***")
                state = newState;
                console.log("***  STATE CHANGED:  ", state, "  ***")
            };
            return [state, setState];
        }
    };
    if (dispatcher === null) {
        console.error(
            'Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for' +
            ' one of the following reasons:\n' +
            '1. You might have mismatching versions of React and the renderer (such as React DOM)\n' +
            '2. You might be breaking the Rules of Hooks\n' +
            '3. You might have more than one copy of React in the same app\n' +
            'See https://react.dev/link/invalid-hook-call for tips about how to debug and fix this problem.',
        );
    }
    // Will result in a null access error if accessed outside render phase. We
    // intentionally don't throw our own error because this is in a hot path.
    // Also helps ensure this is inlined.
    return dispatcher as Dispatcher;
}
