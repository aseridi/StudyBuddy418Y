import type { SupabaseClient } from '@supabase/supabase-js';
import { Database, StudentContext } from '@/types/database';
type Client = SupabaseClient<Database>;
export async function getCourses(client: Client, userId: string) {
    const { data, error } = await client
        .from('courses')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('created_at', { ascending: false });
    if (error)
        throw error;
    return data;
}
export async function getCourse(client: Client, courseId: string) {
    const { data, error } = await client
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .single();
    if (error)
        throw error;
    return data;
}
export async function createCourse(client: Client, course: Database['public']['Tables']['courses']['Insert']) {
    const { data, error } = await client
        .from('courses')
        .insert(course)
        .select()
        .single();
    if (error)
        throw error;
    return data;
}
export async function getAssignments(client: Client, userId: string, options?: {
    courseId?: string;
    status?: string;
    dueBefore?: Date;
    dueAfter?: Date;
}) {
    let query = client
        .from('assignments')
        .select('*, courses(name, code, color)')
        .eq('user_id', userId);
    if (options?.courseId) {
        query = query.eq('course_id', options.courseId);
    }
    if (options?.status) {
        query = query.eq('status', options.status);
    }
    if (options?.dueBefore) {
        query = query.lte('due_date', options.dueBefore.toISOString());
    }
    if (options?.dueAfter) {
        query = query.gte('due_date', options.dueAfter.toISOString());
    }
    const { data, error } = await query.order('due_date', { ascending: true });
    if (error)
        throw error;
    return data;
}
export async function getUpcomingAssignments(client: Client, userId: string, days: number = 14) {
    const now = new Date();
    const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    return getAssignments(client, userId, {
        dueAfter: now,
        dueBefore: futureDate
    });
}
export async function getAssignment(client: Client, assignmentId: string) {
    const { data, error } = await client
        .from('assignments')
        .select('*, courses(name, code, color)')
        .eq('id', assignmentId)
        .single();
    if (error)
        throw error;
    return data;
}
export async function createAssignment(client: Client, assignment: Database['public']['Tables']['assignments']['Insert']) {
    const { data, error } = await client
        .from('assignments')
        .insert(assignment)
        .select()
        .single();
    if (error)
        throw error;
    return data;
}
export async function updateAssignment(client: Client, assignmentId: string, updates: Database['public']['Tables']['assignments']['Update']) {
    const { data, error } = await client
        .from('assignments')
        .update(updates)
        .eq('id', assignmentId)
        .select()
        .single();
    if (error)
        throw error;
    return data;
}
export async function createWorkSubmission(client: Client, submission: Database['public']['Tables']['work_submissions']['Insert']) {
    const { data, error } = await client
        .from('work_submissions')
        .insert(submission)
        .select()
        .single();
    if (error)
        throw error;
    return data;
}
export async function getWorkSubmissions(client: Client, assignmentId: string) {
    const { data, error } = await client
        .from('work_submissions')
        .select('*')
        .eq('assignment_id', assignmentId)
        .order('created_at', { ascending: false });
    if (error)
        throw error;
    return data;
}
export async function updateWorkSubmission(client: Client, submissionId: string, updates: Database['public']['Tables']['work_submissions']['Update']) {
    const { data, error } = await client
        .from('work_submissions')
        .update(updates)
        .eq('id', submissionId)
        .select()
        .single();
    if (error)
        throw error;
    return data;
}
export async function getMaterials(client: Client, courseId: string, options?: {
    type?: string;
    processed?: boolean;
}) {
    let query = client
        .from('materials')
        .select('*')
        .eq('course_id', courseId);
    if (options?.type) {
        query = query.eq('material_type', options.type);
    }
    if (options?.processed !== undefined) {
        query = query.eq('is_processed', options.processed);
    }
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error)
        throw error;
    return data;
}
export async function createMaterial(client: Client, material: Database['public']['Tables']['materials']['Insert']) {
    const { data, error } = await client
        .from('materials')
        .insert(material)
        .select()
        .single();
    if (error)
        throw error;
    return data;
}
export async function updateMaterial(client: Client, materialId: string, updates: Database['public']['Tables']['materials']['Update']) {
    const { data, error } = await client
        .from('materials')
        .update(updates)
        .eq('id', materialId)
        .select()
        .single();
    if (error)
        throw error;
    return data;
}
export async function getStudentContext(client: Client, userId: string, courseId?: string): Promise<StudentContext | null> {
    let query = client
        .from('student_context')
        .select('*')
        .eq('user_id', userId);
    if (courseId) {
        query = query.eq('course_id', courseId);
    }
    else {
        query = query.is('course_id', null);
    }
    const { data, error } = await query.single();
    if (error && error.code !== 'PGRST116')
        throw error;
    return data;
}
export async function upsertStudentContext(client: Client, context: Database['public']['Tables']['student_context']['Insert']) {
    const { data, error } = await client
        .from('student_context')
        .upsert(context, {
        onConflict: 'user_id,course_id'
    })
        .select()
        .single();
    if (error)
        throw error;
    return data;
}
export async function updateStudentContext(client: Client, contextId: string, updates: Database['public']['Tables']['student_context']['Update']) {
    const { data, error } = await client
        .from('student_context')
        .update(updates)
        .eq('id', contextId)
        .select()
        .single();
    if (error)
        throw error;
    return data;
}
export async function getCalendarEvents(client: Client, userId: string, startDate: Date, endDate: Date) {
    const { data, error } = await client
        .from('calendar_events')
        .select('*, courses(name, color)')
        .eq('user_id', userId)
        .gte('start_time', startDate.toISOString())
        .lte('start_time', endDate.toISOString())
        .order('start_time', { ascending: true });
    if (error)
        throw error;
    return data;
}
export async function createCalendarEvent(client: Client, event: Database['public']['Tables']['calendar_events']['Insert']) {
    const { data, error } = await client
        .from('calendar_events')
        .insert(event)
        .select()
        .single();
    if (error)
        throw error;
    return data;
}
export async function getPendingNotifications(client: Client, userId: string) {
    const { data, error } = await client
        .from('notifications')
        .select('*, assignments(title, due_date)')
        .eq('user_id', userId)
        .eq('is_sent', false)
        .lte('scheduled_for', new Date().toISOString())
        .order('scheduled_for', { ascending: true });
    if (error)
        throw error;
    return data;
}
export async function getUnreadNotifications(client: Client, userId: string) {
    const { data, error } = await client
        .from('notifications')
        .select('*, assignments(title, due_date)')
        .eq('user_id', userId)
        .eq('is_sent', true)
        .eq('is_read', false)
        .order('sent_at', { ascending: false });
    if (error)
        throw error;
    return data;
}
export async function createNotification(client: Client, notification: Database['public']['Tables']['notifications']['Insert']) {
    const { data, error } = await client
        .from('notifications')
        .insert(notification)
        .select()
        .single();
    if (error)
        throw error;
    return data;
}
export async function markNotificationSent(client: Client, notificationId: string) {
    const { error } = await client
        .from('notifications')
        .update({ is_sent: true, sent_at: new Date().toISOString() })
        .eq('id', notificationId);
    if (error)
        throw error;
}
export async function markNotificationRead(client: Client, notificationId: string) {
    const { error } = await client
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);
    if (error)
        throw error;
}
export async function createChatSession(client: Client, session: Database['public']['Tables']['chat_sessions']['Insert']) {
    const { data, error } = await client
        .from('chat_sessions')
        .insert(session)
        .select()
        .single();
    if (error)
        throw error;
    return data;
}
export async function getChatSessions(client: Client, userId: string, courseId?: string) {
    let query = client
        .from('chat_sessions')
        .select('*')
        .eq('user_id', userId);
    if (courseId) {
        query = query.eq('course_id', courseId);
    }
    const { data, error } = await query.order('updated_at', { ascending: false });
    if (error)
        throw error;
    return data;
}
export async function getChatMessages(client: Client, sessionId: string) {
    const { data, error } = await client
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });
    if (error)
        throw error;
    return data;
}
export async function createChatMessage(client: Client, message: Database['public']['Tables']['chat_messages']['Insert']) {
    const { data, error } = await client
        .from('chat_messages')
        .insert(message)
        .select()
        .single();
    if (error)
        throw error;
    return data;
}
export async function getChatSession(client: Client, sessionId: string) {
    const { data, error } = await client
        .from('chat_sessions')
        .select('*, courses(name, code, color)')
        .eq('id', sessionId)
        .single();
    if (error)
        throw error;
    return data;
}
export async function updateChatSession(client: Client, sessionId: string, updates: Database['public']['Tables']['chat_sessions']['Update']) {
    const { data, error } = await client
        .from('chat_sessions')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', sessionId)
        .select()
        .single();
    if (error)
        throw error;
    return data;
}
export async function deleteChatSession(client: Client, sessionId: string) {
    const { error: messagesError } = await client
        .from('chat_messages')
        .delete()
        .eq('session_id', sessionId);
    if (messagesError)
        throw messagesError;
    const { error } = await client
        .from('chat_sessions')
        .delete()
        .eq('id', sessionId);
    if (error)
        throw error;
}
export async function updateChatMessageRating(client: Client, messageId: string, rating: number) {
    const { data, error } = await client
        .from('chat_messages')
        .update({ helpful_rating: rating })
        .eq('id', messageId)
        .select()
        .single();
    if (error)
        throw error;
    return data;
}
export async function getChatSessionsWithPreview(client: Client, userId: string, options?: {
    courseId?: string;
    limit?: number;
    offset?: number;
}) {
    let query = client
        .from('chat_sessions')
        .select('*, courses(name, code, color)')
        .eq('user_id', userId);
    if (options?.courseId) {
        query = query.eq('course_id', options.courseId);
    }
    const { data, error } = await query
        .order('updated_at', { ascending: false })
        .range(options?.offset || 0, (options?.offset || 0) + (options?.limit || 20) - 1);
    if (error)
        throw error;
    return data;
}
export async function getRecentChatSessionMemory(client: Client, userId: string, options?: {
    courseId?: string;
    limit?: number;
    excludeSessionId?: string;
}) {
    let query = client
        .from('chat_sessions')
        .select('id, title, summary, topics_discussed, course_id, updated_at')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
        .limit(options?.limit || 10);
    if (options?.courseId) {
        query = query.eq('course_id', options.courseId);
    }
    if (options?.excludeSessionId) {
        query = query.neq('id', options.excludeSessionId);
    }
    const { data, error } = await query;
    if (error)
        throw error;
    return data || [];
}
export async function getRecentWorkSubmissions(client: Client, userId: string, options?: {
    limit?: number;
    courseId?: string;
}) {
    let query = client
        .from('work_submissions')
        .select('id, assignment_id, submission_type, is_valid, validation_score, validation_feedback, submitted_at, assignments(title, course_id, due_date, status)')
        .eq('user_id', userId)
        .order('submitted_at', { ascending: false })
        .limit(options?.limit || 10);
    const { data, error } = await query;
    if (error)
        throw error;
    if (options?.courseId && data) {
        return data.filter((s: any) => s.assignments?.course_id === options.courseId);
    }
    return data || [];
}
export async function getRecentlyCompletedAssignments(client: Client, userId: string, options?: {
    limit?: number;
    daysBack?: number;
}) {
    const daysBack = options?.daysBack || 30;
    const cutoff = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000);
    const { data, error } = await client
        .from('assignments')
        .select('id, title, course_id, status, completed_at, tags, courses(name, code)')
        .eq('user_id', userId)
        .in('status', ['completed', 'submitted'])
        .gte('completed_at', cutoff.toISOString())
        .order('completed_at', { ascending: false })
        .limit(options?.limit || 10);
    if (error)
        throw error;
    return data || [];
}
export async function getFullStudentContext(client: Client, userId: string, courseId?: string): Promise<{
    global: any | null;
    course: any | null;
}> {
    const { data: globalCtx, error: globalErr } = await client
        .from('student_context')
        .select('*')
        .eq('user_id', userId)
        .is('course_id', null)
        .single();
    if (globalErr && globalErr.code !== 'PGRST116')
        throw globalErr;
    let courseCtx = null;
    if (courseId) {
        const { data, error } = await client
            .from('student_context')
            .select('*')
            .eq('user_id', userId)
            .eq('course_id', courseId)
            .single();
        if (error && error.code !== 'PGRST116')
            throw error;
        courseCtx = data;
    }
    return { global: globalCtx, course: courseCtx };
}
export async function getUpcomingAssignmentsDetailed(client: Client, userId: string, days: number = 14) {
    const now = new Date();
    const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    const { data, error } = await client
        .from('assignments')
        .select('id, title, description, notes, due_date, status, priority, estimated_minutes, tags, work_validated, course_id, courses(name, code)')
        .eq('user_id', userId)
        .gte('due_date', now.toISOString())
        .lte('due_date', futureDate.toISOString())
        .order('due_date', { ascending: true });
    if (error)
        throw error;
    return data || [];
}
