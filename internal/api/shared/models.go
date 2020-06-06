package shared

type ErrorResponse struct {
	Error string `json:"error"`
}

type PaginatedResponse struct {
	Count  int `json:"count"`
	Limit  int `json:"limit"`
	Offset int `json:"offset"`
}
