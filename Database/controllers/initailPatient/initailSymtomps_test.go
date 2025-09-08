package controllers_test

import(
	"Database/controllers/initailPatient"
	"github.com/gin-gonic/gin"
	"testing"
)

func TestCreateSymptom(t *testing.T) {
	tests := []struct {
		name string // description of this test case
		// Named input parameters for target function.
		c *gin.Context
	}{
		// TODO: Add test cases.
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			controllers.CreateSymptom(tt.c)
		})
	}
}
