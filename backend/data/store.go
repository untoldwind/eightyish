package data

type Store struct {
	Classrooms map[string]*Classroom
}

func NewStore() *Store {
	return &Store{
		Classrooms: make(map[string]*Classroom, 0),
	}
}
