CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    semester_start_date DATE,
    current_semester TEXT,
    timezone TEXT DEFAULT 'America/New_York',
    notification_email TEXT,
    notification_preferences JSONB DEFAULT '{
        "email_enabled": true,
        "browser_enabled": true,
        "quiet_hours_start": "22:00",
        "quiet_hours_end": "08:00",
        "reminder_days_before": [14, 8, 5, 3, 1]
    }'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    code TEXT,
    professor TEXT,
    description TEXT,
    start_date DATE,
    end_date DATE,
    schedule JSONB,
    color TEXT DEFAULT '#3B82F6',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.student_context (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    current_week INTEGER DEFAULT 1,
    struggle_areas TEXT[] DEFAULT '{}',
    strength_areas TEXT[] DEFAULT '{}',
    learning_style TEXT,
    preferred_explanation_depth TEXT DEFAULT 'detailed',
    recent_topics_studied TEXT[] DEFAULT '{}',
    last_study_session TIMESTAMPTZ,
    total_study_hours DECIMAL(10,2) DEFAULT 0,
    instructor_notes TEXT,
    personal_goals TEXT[],
    context_summary TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, course_id)
);

CREATE TABLE public.materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    material_type TEXT NOT NULL,
    original_filename TEXT,
    file_url TEXT,
    file_size INTEGER,
    raw_text TEXT,
    extracted_topics TEXT[] DEFAULT '{}',
    extracted_dates JSONB DEFAULT '[]',
    extracted_action_items JSONB DEFAULT '[]',
    extracted_requirements TEXT[],
    is_processed BOOLEAN DEFAULT false,
    processing_error TEXT,
    source_text TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.material_embeddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    material_id UUID NOT NULL REFERENCES public.materials(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    chunk_index INTEGER NOT NULL,
    chunk_text TEXT NOT NULL,
    embedding vector(1536),
    topics TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    material_id UUID REFERENCES public.materials(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    instructions TEXT,
    due_date TIMESTAMPTZ NOT NULL,
    start_date TIMESTAMPTZ,
    status TEXT DEFAULT 'not_started',
    work_submitted BOOLEAN DEFAULT false,
    work_validated BOOLEAN DEFAULT false,
    last_submission_at TIMESTAMPTZ,
    priority TEXT DEFAULT 'medium',
    estimated_hours DECIMAL(5,2),
    actual_hours DECIMAL(5,2),
    topics TEXT[] DEFAULT '{}',
    requirements TEXT[],
    notification_active BOOLEAN DEFAULT true,
    notification_silenced_until TIMESTAMPTZ,
    last_notification_sent TIMESTAMPTZ,
    notification_count INTEGER DEFAULT 0,
    grade TEXT,
    feedback TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.work_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    submission_type TEXT NOT NULL,
    content TEXT,
    file_url TEXT,
    file_name TEXT,
    is_validated BOOLEAN DEFAULT false,
    validation_score DECIMAL(3,2),
    validation_feedback TEXT,
    validation_timestamp TIMESTAMPTZ,
    silenced_notifications BOOLEAN DEFAULT false,
    word_count INTEGER,
    line_count INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.calendar_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    assignment_id UUID REFERENCES public.assignments(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    event_type TEXT NOT NULL,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ,
    all_day BOOLEAN DEFAULT false,
    is_recurring BOOLEAN DEFAULT false,
    recurrence_rule TEXT,
    color TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    assignment_id UUID REFERENCES public.assignments(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    notification_type TEXT NOT NULL,
    channel TEXT NOT NULL,
    scheduled_for TIMESTAMPTZ NOT NULL,
    sent_at TIMESTAMPTZ,
    is_sent BOOLEAN DEFAULT false,
    is_read BOOLEAN DEFAULT false,
    is_dismissed BOOLEAN DEFAULT false,
    escalation_level INTEGER DEFAULT 1,
    days_until_due INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.chat_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    course_id UUID REFERENCES public.courses(id) ON DELETE SET NULL,
    title TEXT,
    summary TEXT,
    topics_discussed TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    injected_context JSONB,
    referenced_materials UUID[] DEFAULT '{}',
    helpful_rating INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_courses_user ON public.courses(user_id);
CREATE INDEX idx_materials_course ON public.materials(course_id);
CREATE INDEX idx_materials_user ON public.materials(user_id);
CREATE INDEX idx_assignments_course ON public.assignments(course_id);
CREATE INDEX idx_assignments_user ON public.assignments(user_id);
CREATE INDEX idx_assignments_due_date ON public.assignments(due_date);
CREATE INDEX idx_assignments_status ON public.assignments(status);
CREATE INDEX idx_notifications_user ON public.notifications(user_id);
CREATE INDEX idx_notifications_scheduled ON public.notifications(scheduled_for) WHERE NOT is_sent;
CREATE INDEX idx_chat_messages_session ON public.chat_messages(session_id);
CREATE INDEX idx_material_embeddings_course ON public.material_embeddings(course_id);
CREATE INDEX idx_student_context_user ON public.student_context(user_id);

CREATE INDEX idx_embeddings_vector ON public.material_embeddings
USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_context ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.material_embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can CRUD own courses" ON public.courses FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can CRUD own student_context" ON public.student_context FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can CRUD own materials" ON public.materials FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can CRUD own embeddings" ON public.material_embeddings FOR ALL
    USING (course_id IN (SELECT id FROM public.courses WHERE user_id = auth.uid()));
CREATE POLICY "Users can CRUD own assignments" ON public.assignments FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can CRUD own submissions" ON public.work_submissions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can CRUD own events" ON public.calendar_events FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can CRUD own notifications" ON public.notifications FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can CRUD own chat_sessions" ON public.chat_sessions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can CRUD own chat_messages" ON public.chat_messages FOR ALL USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON public.courses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_student_context_updated_at BEFORE UPDATE ON public.student_context
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_materials_updated_at BEFORE UPDATE ON public.materials
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_assignments_updated_at BEFORE UPDATE ON public.assignments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_calendar_events_updated_at BEFORE UPDATE ON public.calendar_events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_chat_sessions_updated_at BEFORE UPDATE ON public.chat_sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

CREATE OR REPLACE FUNCTION should_send_notification(assignment_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    assignment_record RECORD;
    days_remaining INTEGER;
BEGIN
    SELECT * INTO assignment_record FROM public.assignments WHERE id = assignment_id;

    IF assignment_record.work_validated OR assignment_record.status IN ('completed', 'submitted') THEN
        RETURN FALSE;
    END IF;

    IF assignment_record.notification_silenced_until IS NOT NULL
       AND assignment_record.notification_silenced_until > NOW() THEN
        RETURN FALSE;
    END IF;

    IF NOT assignment_record.notification_active THEN
        RETURN FALSE;
    END IF;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_student_context(p_user_id UUID, p_course_id UUID DEFAULT NULL)
RETURNS JSONB AS $$
DECLARE
    context JSONB;
BEGIN
    SELECT jsonb_build_object(
        'current_week', sc.current_week,
        'struggle_areas', sc.struggle_areas,
        'strength_areas', sc.strength_areas,
        'learning_style', sc.learning_style,
        'recent_topics', sc.recent_topics_studied,
        'last_study_session', sc.last_study_session,
        'context_summary', sc.context_summary
    ) INTO context
    FROM public.student_context sc
    WHERE sc.user_id = p_user_id
    AND (p_course_id IS NULL OR sc.course_id = p_course_id)
    LIMIT 1;

    RETURN COALESCE(context, '{}'::jsonb);
END;
$$ LANGUAGE plpgsql;
