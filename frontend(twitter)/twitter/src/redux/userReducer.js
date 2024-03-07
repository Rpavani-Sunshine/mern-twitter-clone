const initialState = {
    user: {}
}

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case "LOGIN_SUCCESS":
            return {
                ...state, user: action.payload
            }
        case "LOGIN_ERROR":
            return state;
        default:
            return state;
    }
}
export default userReducer