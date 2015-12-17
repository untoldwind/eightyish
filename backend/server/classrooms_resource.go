package server

import (
	"github.com/untoldwind/eightyish/backend/data"
	"github.com/untoldwind/eightyish/backend/logging"
	"github.com/untoldwind/routing"
	"net/http"
)

type classroomsResource struct {
	store  *data.Store
	logger logging.Logger
}

func (s *Server) ClassroomsRoutes() routing.Matcher {
	resource := &classroomsResource{
		store:  s.store,
		logger: s.logger.WithContext(map[string]interface{}{"resource": "classrooms"}),
	}
	return routing.PrefixSeq("/classrooms",
		routing.StringPart(func(classroomName string) routing.Matcher {
			return routing.EndSeq(
				routing.GETFunc(resource.wrapWithClassroom(classroomName, resource.GetClassroom)),
				routing.PUTFunc(resource.wrapWithClassroom(classroomName, resource.UpdateClassroom)),
				routing.DELETEFunc(resource.DeleteClassroom(classroomName)),
				routing.MethodNotAllowed,
			)
		}),
		routing.EndSeq(
			routing.POSTFunc(wrap(resource.logger, resource.CreateClassroom)),
			routing.MethodNotAllowed,
		),
	)
}

func (r *classroomsResource) CreateClassroom(req *http.Request) (interface{}, error) {
	return nil, nil
}

func (r *classroomsResource) GetClassroom(classroom *data.Classroom, req *http.Request) (interface{}, error) {
	return classroom, nil
}

func (r *classroomsResource) UpdateClassroom(classroom *data.Classroom, req *http.Request) (interface{}, error) {
	return nil, nil
}

func (r *classroomsResource) DeleteClassroom(classroomName string) func(resp http.ResponseWriter, req *http.Request) {
	return wrap(r.logger, func(req *http.Request) (interface{}, error) {
		return nil, nil
	})
}

func (r *classroomsResource) wrapWithClassroom(classroomName string, handler func(*data.Classroom, *http.Request) (interface{}, error)) func(resp http.ResponseWriter, req *http.Request) {
	return wrap(r.logger, func(req *http.Request) (interface{}, error) {
		if classroom, ok := r.store.Classrooms[classroomName]; ok {
			return handler(classroom, req)
		}
		return nil, NotFound()
	})
}
