import React, { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthProvider';
import { 
  useInstructorProfile, 
  useUpdateInstructorProfile, 
  useRequestVerification,
  useInstructorDashboard 
} from '../../features/instructor/queries';
import { useStudentDashboard } from '../../features/dashboard/queries';
import { useAdminDashboard } from '../../features/admin/queries';
import { 
  useEmailPreferences, 
  useUpdateEmailPreferences 
} from '../../features/profile/queries';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Shield,
  ShieldCheck,
  CheckCircle2,
  BookOpen,
  Layers,
  Award,
  Clock,
  Key,
  LogOut,
  Edit2,
  Bell,
  Check,
  GraduationCap,
  Building
} from 'lucide-react';

export function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const role = user?.role || 'STUDENT';
  const isStudent = role === 'STUDENT';
  const isInstructor = role === 'INSTRUCTOR';
  const isAdmin = role === 'ADMIN';

  // Navigation tab state
  const [activeTab, setActiveTab] = useState<'overview' | 'role_folio' | 'dispatches' | 'security'>('overview');

  // Role queries (enabled conditionally to prevent unauthorized 403s)
  const { data: instructorProfile } = useInstructorProfile({ enabled: !!user && isInstructor });
  const { data: instructorDashboard } = useInstructorDashboard({ enabled: !!user && isInstructor });
  const { data: studentDashboard } = useStudentDashboard({ enabled: !!user && isStudent });
  const { data: adminDashboard } = useAdminDashboard({ enabled: !!user && isAdmin });

  // Email notifications preferences
  const { data: emailPrefs, isLoading: prefsLoading } = useEmailPreferences();
  const updateEmailPrefs = useUpdateEmailPreferences();

  // Instructor profile update mutation
  const updateInstructorProfile = useUpdateInstructorProfile();
  const requestVerification = useRequestVerification();

  // Instructor editable form fields
  const [isEditingInstructor, setIsEditingInstructor] = useState(false);
  const [bio, setBio] = useState('');
  const [expertise, setExpertise] = useState('');

  // Student extra customized profile fields (persisted locally)
  const [studentDiscipline, setStudentDiscipline] = useState(() => {
    return localStorage.getItem(`lumina_student_discipline_${user?.id}`) || 'Computer Science & Software Engineering';
  });
  const [studentDegree, setStudentDegree] = useState(() => {
    return localStorage.getItem(`lumina_student_degree_${user?.id}`) || 'Enrolled Student';
  });
  const [studentPacing, setStudentPacing] = useState(() => {
    return localStorage.getItem(`lumina_student_pacing_${user?.id}`) || 'Self-Paced Flexible';
  });
  const [studentTags, setStudentTags] = useState<string[]>(() => {
    const saved = localStorage.getItem(`lumina_student_tags_${user?.id}`);
    return saved ? JSON.parse(saved) : ['Web Development', 'System Architecture', 'Algorithms', 'Cloud Computing'];
  });
  const [isEditingStudent, setIsEditingStudent] = useState(false);
  const [newTagInput, setNewTagInput] = useState('');

  // Email notifications preference state
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [prefSaveSuccess, setPrefSaveSuccess] = useState(false);

  useEffect(() => {
    if (instructorProfile) {
      setBio(instructorProfile.bio || '');
      setExpertise(instructorProfile.expertise || '');
    }
  }, [instructorProfile]);

  useEffect(() => {
    if (emailPrefs !== undefined) {
      setEmailEnabled(emailPrefs.emailNotificationsEnabled);
    }
  }, [emailPrefs]);

  if (!user) {
    return null;
  }

  const handleInstructorSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateInstructorProfile.mutate(
      { bio: bio.trim(), expertise: expertise.trim() },
      { onSuccess: () => setIsEditingInstructor(false) }
    );
  };

  const handleStudentSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem(`lumina_student_discipline_${user.id}`, studentDiscipline);
    localStorage.setItem(`lumina_student_degree_${user.id}`, studentDegree);
    localStorage.setItem(`lumina_student_pacing_${user.id}`, studentPacing);
    localStorage.setItem(`lumina_student_tags_${user.id}`, JSON.stringify(studentTags));
    setIsEditingStudent(false);
  };

  const handleAddStudentTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = newTagInput.trim().replace(/^,+|,+$/g, '');
      if (val && !studentTags.includes(val)) {
        setStudentTags([...studentTags, val]);
        setNewTagInput('');
      }
    }
  };

  const handleToggleEmailPrefs = () => {
    const nextVal = !emailEnabled;
    setEmailEnabled(nextVal);
    updateEmailPrefs.mutate(
      { emailNotificationsEnabled: nextVal },
      {
        onSuccess: () => {
          setPrefSaveSuccess(true);
          setTimeout(() => setPrefSaveSuccess(false), 3000);
        }
      }
    );
  };

  // Role visual styling & titles
  const roleDisplay = {
    STUDENT: {
      title: 'Student Account',
      shortTitle: 'Student',
      badgeBg: 'bg-[#eeeeec]',
      badgeText: 'text-[#373734]',
      dotColor: 'bg-[#373734]',
      borderAccent: 'border-[#121212]',
      folioPrefix: 'LUM-STUDENT',
      description: 'Enrolled in courses, video lessons, quizzes, and practical assignments.'
    },
    INSTRUCTOR: {
      title: 'Course Instructor',
      shortTitle: 'Instructor',
      badgeBg: 'bg-[#faecd8]',
      badgeText: 'text-[#8c501e]',
      dotColor: 'bg-[#d97757]',
      borderAccent: 'border-[#d97757]',
      folioPrefix: 'LUM-INSTRUCTOR',
      description: 'Authorized to publish courses, design curriculum syllabi, and grade student assignments.'
    },
    ADMIN: {
      title: 'Platform Administrator',
      shortTitle: 'Administrator',
      badgeBg: 'bg-[#121212]',
      badgeText: 'text-[#f8f8f6]',
      dotColor: 'bg-[#d97757]',
      borderAccent: 'border-[#121212]',
      folioPrefix: 'LUM-ADMIN',
      description: 'Platform management: review submitted courses, manage users, and platform settings.'
    }
  }[role];

  return (
    <div className="flex flex-col w-full max-w-[1200px] mx-auto pb-20">
      {/* ── Breadcrumb & Context ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-[#e7e6e1] text-xs font-mono text-[#7b7974]">
        <div className="flex items-center gap-2 flex-wrap">
          <Link to="/" className="hover:text-[#121212] transition-colors">Lumina Learning</Link>
          <span>/</span>
          <span>Profile &amp; Settings</span>
          <span>/</span>
          <span className="text-[#121212] font-semibold">{user.name}</span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[11px] text-[#9c9a92]">
          <span>Account ID:</span>
          <span className="bg-[#efeeeb] text-[#121212] px-2 py-0.5 rounded font-bold">
            {roleDisplay.folioPrefix}-{user.id.slice(0, 8).toUpperCase()}
          </span>
        </div>
      </div>

      {/* ── Main Scholar Identity Header Card ── */}
      <div className="bg-[#ffffff] rounded-2xl p-6 sm:p-8 border border-[#e7e6e1] shadow-xs mb-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Left Avatar & Identity */}
          <div className="flex items-start sm:items-center gap-5">
            {/* Monogram Seal Avatar */}
            <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-[#121212] text-[#f8f8f6] flex items-center justify-center font-heading text-3xl italic font-normal shrink-0 shadow-sm border-2 border-[#e7e6e1]">
              {user.name.charAt(0).toUpperCase()}
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="font-heading text-2xl sm:text-3xl text-[#121212] font-normal tracking-tight">
                  {user.name}
                </h1>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${roleDisplay.badgeBg} ${roleDisplay.badgeText} font-mono text-[11px] font-bold tracking-wider uppercase`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${roleDisplay.dotColor}`} />
                  {roleDisplay.shortTitle}
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#eaf4ea] text-[#245222] font-mono text-[10px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4b7a47]" />
                  ACCOUNT ACTIVE
                </span>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono text-[#7b7974] flex-wrap pt-0.5">
                <span className="flex items-center gap-1.5 text-[#373734]">
                  <Mail className="w-3.5 h-3.5 text-[#9c9a92]" />
                  <span>{user.email}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-[#373734]">
                  <Building className="w-3.5 h-3.5 text-[#9c9a92]" />
                  <span>Lumina Learning Platform</span>
                </span>
              </div>

              <p className="font-body text-xs text-[#7b7974] max-w-2xl pt-1 leading-relaxed">
                {roleDisplay.description}
              </p>
            </div>
          </div>

          {/* Quick Context Action */}
          <div className="flex items-center gap-2 self-start md:self-auto shrink-0 flex-wrap">
            {isStudent && (
              <Link
                to="/learn"
                className="px-4 py-2 rounded-xl bg-[#121212] text-[#f8f8f6] hover:bg-black font-body text-xs font-medium transition-all shadow-xs flex items-center gap-1.5"
              >
                <BookOpen className="w-3.5 h-3.5 text-[#d97757]" />
                <span>My Learning</span>
              </Link>
            )}

            {isInstructor && (
              <Link
                to="/instructor/courses"
                className="px-4 py-2 rounded-xl bg-[#121212] text-[#f8f8f6] hover:bg-black font-body text-xs font-medium transition-all shadow-xs flex items-center gap-1.5"
              >
                <Layers className="w-3.5 h-3.5 text-[#d97757]" />
                <span>Course Studio</span>
              </Link>
            )}

            {isAdmin && (
              <Link
                to="/admin"
                className="px-4 py-2 rounded-xl bg-[#121212] text-[#f8f8f6] hover:bg-black font-body text-xs font-medium transition-all shadow-xs flex items-center gap-1.5"
              >
                <Shield className="w-3.5 h-3.5 text-[#d97757]" />
                <span>Admin Dashboard</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ── Navigation Tab Bar ── */}
      <div className="flex items-center gap-1.5 bg-[#efeeeb] p-1 rounded-xl max-w-fit border border-[#e7e6e1] shadow-2xs mb-6 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-body font-medium transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'overview'
              ? 'bg-[#ffffff] text-[#121212] shadow-xs'
              : 'text-[#7b7974] hover:text-[#121212] hover:bg-[#ffffff]/50'
          }`}
        >
          <User className="w-3.5 h-3.5 text-[#121212]" />
          <span>Profile Overview</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('role_folio')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-body font-medium transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'role_folio'
              ? 'bg-[#ffffff] text-[#121212] shadow-xs'
              : 'text-[#7b7974] hover:text-[#121212] hover:bg-[#ffffff]/50'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5 text-[#121212]" />
          <span>
            {isStudent && 'Learning Preferences & Track'}
            {isInstructor && 'Instructor Bio & Verification'}
            {isAdmin && 'Administration & Moderation'}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#d97757]" />
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('dispatches')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-body font-medium transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'dispatches'
              ? 'bg-[#ffffff] text-[#121212] shadow-xs'
              : 'text-[#7b7974] hover:text-[#121212] hover:bg-[#ffffff]/50'
          }`}
        >
          <Bell className="w-3.5 h-3.5 text-[#7b7974]" />
          <span>Email &amp; Notifications</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-body font-medium transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'security'
              ? 'bg-[#ffffff] text-[#121212] shadow-xs'
              : 'text-[#7b7974] hover:text-[#121212] hover:bg-[#ffffff]/50'
          }`}
        >
          <Key className="w-3.5 h-3.5 text-[#7b7974]" />
          <span>Security &amp; Session</span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* TAB 1: PROFILE OVERVIEW                                        */}
      {/* ============================================================== */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Column: Core Credentials Form & Role Metadata */}
          <div className="md:col-span-8 flex flex-col gap-6">
            <div className="bg-[#ffffff] rounded-2xl p-6 sm:p-7 border border-[#e7e6e1] shadow-xs flex flex-col gap-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#e7e6e1]">
                <div className="flex flex-col">
                  <h2 className="font-heading text-lg sm:text-xl text-[#121212] font-normal">
                    User Profile &amp; Account Details
                  </h2>
                  <span className="font-body text-xs text-[#7b7974]">
                    Your verified Lumina user profile
                  </span>
                </div>
                <span className="font-mono text-[11px] text-[#9c9a92]">STATUS: ACTIVE</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1 p-3 rounded-xl bg-[#f8f8f6] border border-[#e7e6e1]">
                  <span className="font-mono text-[10px] uppercase text-[#7b7974] font-semibold">Full Name</span>
                  <span className="font-body text-sm font-semibold text-[#121212]">{user.name}</span>
                </div>

                <div className="flex flex-col gap-1 p-3 rounded-xl bg-[#f8f8f6] border border-[#e7e6e1]">
                  <span className="font-mono text-[10px] uppercase text-[#7b7974] font-semibold">Email Address</span>
                  <span className="font-body text-sm font-semibold text-[#121212]">{user.email}</span>
                </div>

                <div className="flex flex-col gap-1 p-3 rounded-xl bg-[#f8f8f6] border border-[#e7e6e1]">
                  <span className="font-mono text-[10px] uppercase text-[#7b7974] font-semibold">Role</span>
                  <span className="font-body text-sm font-semibold text-[#121212]">{roleDisplay.title}</span>
                </div>

                <div className="flex flex-col gap-1 p-3 rounded-xl bg-[#f8f8f6] border border-[#e7e6e1]">
                  <span className="font-mono text-[10px] uppercase text-[#7b7974] font-semibold">User ID</span>
                  <span className="font-mono text-xs text-[#373734] font-medium">{user.id}</span>
                </div>
              </div>

              {/* Quick Role Specific Summary inside Overview */}
              {isStudent && (
                <div className="p-4 rounded-xl bg-[#efeeeb]/70 border border-[#e7e6e1] flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-[#d97757] shrink-0" />
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-[#121212]">Learning Discipline</span>
                      <span className="text-[11px] text-[#7b7974]">{studentDiscipline}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('role_folio')}
                    className="text-xs font-mono text-[#d97757] hover:underline font-semibold"
                  >
                    Edit Preferences →
                  </button>
                </div>
              )}

              {isInstructor && instructorProfile && (
                <div className="p-4 rounded-xl bg-[#efeeeb]/70 border border-[#e7e6e1] flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#121212] flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-[#d97757]" />
                      <span>Instructor Biography &amp; Background</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveTab('role_folio')}
                      className="text-xs font-mono text-[#d97757] hover:underline font-semibold"
                    >
                      Update Bio →
                    </button>
                  </div>
                  <p className="text-xs font-body text-[#373734] line-clamp-2 leading-relaxed">
                    {instructorProfile.bio || 'No instructor bio added yet. Click to define your professional background.'}
                  </p>
                </div>
              )}

              {isAdmin && (
                <div className="p-4 rounded-xl bg-[#efeeeb]/70 border border-[#e7e6e1] flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-[#d97757] shrink-0" />
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-[#121212]">Platform Administration</span>
                      <span className="text-[11px] text-[#7b7974]">Full administrator permissions &amp; course moderation</span>
                    </div>
                  </div>
                  <Link
                    to="/admin"
                    className="text-xs font-mono text-[#d97757] hover:underline font-semibold"
                  >
                    Admin Console →
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Live Overview Metrics Card */}
          <div className="md:col-span-4 flex flex-col gap-5">
            {/* Student Stats */}
            {isStudent && (
              <div className="bg-[#ffffff] rounded-2xl p-5 border border-[#e7e6e1] shadow-xs flex flex-col gap-4">
                <span className="font-heading text-base text-[#121212]">Learning Overview</span>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-[#f8f8f6] border border-[#e7e6e1] flex flex-col">
                    <span className="font-heading text-xl text-[#121212]">
                      {studentDashboard?.totalEnrolledCourses || 0}
                    </span>
                    <span className="font-mono text-[10px] text-[#7b7974] uppercase">Enrolled</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#f8f8f6] border border-[#e7e6e1] flex flex-col">
                    <span className="font-heading text-xl text-[#121212]">
                      {studentDashboard?.completedCourses || 0}
                    </span>
                    <span className="font-mono text-[10px] text-[#7b7974] uppercase">Completed</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#f8f8f6] border border-[#e7e6e1] flex flex-col">
                    <span className="font-heading text-xl text-[#121212]">
                      {studentDashboard?.quizzesPassed || 0}
                    </span>
                    <span className="font-mono text-[10px] text-[#7b7974] uppercase">Quizzes</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#f8f8f6] border border-[#e7e6e1] flex flex-col">
                    <span className="font-heading text-xl text-[#d97757]">
                      {studentDashboard?.overallCourseCompletionPercentage || 0}%
                    </span>
                    <span className="font-mono text-[10px] text-[#7b7974] uppercase">Progress</span>
                  </div>
                </div>
              </div>
            )}

            {/* Instructor Stats */}
            {isInstructor && (
              <div className="bg-[#ffffff] rounded-2xl p-5 border border-[#e7e6e1] shadow-xs flex flex-col gap-4">
                <span className="font-heading text-base text-[#121212]">Faculty Metrics</span>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-[#f8f8f6] border border-[#e7e6e1] flex flex-col">
                    <span className="font-heading text-xl text-[#121212]">
                      {instructorDashboard?.totalCoursesOwned || 0}
                    </span>
                    <span className="font-mono text-[10px] text-[#7b7974] uppercase">Authored</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#f8f8f6] border border-[#e7e6e1] flex flex-col">
                    <span className="font-heading text-xl text-[#121212]">
                      {instructorDashboard?.totalEnrolledStudents || 0}
                    </span>
                    <span className="font-mono text-[10px] text-[#7b7974] uppercase">Learners</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#f8f8f6] border border-[#e7e6e1] flex flex-col">
                    <span className="font-heading text-xl text-[#121212]">
                      ★ {instructorDashboard?.averageRating ? instructorDashboard.averageRating.toFixed(1) : '5.0'}
                    </span>
                    <span className="font-mono text-[10px] text-[#7b7974] uppercase">Rating</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#f8f8f6] border border-[#e7e6e1] flex flex-col">
                    <span className="font-heading text-xl text-[#d97757]">
                      {instructorDashboard?.publishedCourses || 0}
                    </span>
                    <span className="font-mono text-[10px] text-[#7b7974] uppercase">Published</span>
                  </div>
                </div>
              </div>
            )}

            {/* Admin Stats */}
            {isAdmin && (
              <div className="bg-[#ffffff] rounded-2xl p-5 border border-[#e7e6e1] shadow-xs flex flex-col gap-4">
                <span className="font-heading text-base text-[#121212]">Platform Governance</span>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-[#f8f8f6] border border-[#e7e6e1] flex flex-col">
                    <span className="font-heading text-xl text-[#121212]">
                      {adminDashboard?.users?.total || 0}
                    </span>
                    <span className="font-mono text-[10px] text-[#7b7974] uppercase">Total Users</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#f8f8f6] border border-[#e7e6e1] flex flex-col">
                    <span className="font-heading text-xl text-[#121212]">
                      {adminDashboard?.courses?.total || 0}
                    </span>
                    <span className="font-mono text-[10px] text-[#7b7974] uppercase">Curricula</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#f8f8f6] border border-[#e7e6e1] flex flex-col">
                    <span className="font-heading text-xl text-[#d97757]">
                      {adminDashboard?.courses?.pendingApproval || 0}
                    </span>
                    <span className="font-mono text-[10px] text-[#7b7974] uppercase">Course PRs</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#f8f8f6] border border-[#e7e6e1] flex flex-col">
                    <span className="font-heading text-xl text-[#121212]">
                      {adminDashboard?.instructors?.pending || 0}
                    </span>
                    <span className="font-mono text-[10px] text-[#7b7974] uppercase">Faculty Apps</span>
                  </div>
                </div>
              </div>
            )}

            {/* Platform Assurance Card */}
            <div className="p-4 rounded-2xl bg-[#f8f8f6] border border-[#e7e6e1] flex flex-col gap-2">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#7b7974] font-semibold">
                Platform Security &amp; Records
              </span>
              <p className="font-body text-xs text-[#7b7974] leading-relaxed">
                All records, quiz scores, and course completions are recorded securely and updated in real-time on your Lumina account.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: ROLE SETTINGS & PROFILE                                 */}
      {/* ============================================================== */}
      {activeTab === 'role_folio' && (
        <div className="flex flex-col gap-6 max-w-3xl mx-auto w-full">
          {/* ──── STUDENT ROLE SPECIFIC FIELDS ──── */}
          {isStudent && (
            <div className="bg-[#ffffff] rounded-2xl p-6 sm:p-8 border border-[#e7e6e1] shadow-xs flex flex-col gap-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#e7e6e1]">
                <div className="flex flex-col">
                  <h2 className="font-heading text-xl sm:text-2xl text-[#121212] font-normal">
                    Student Profile &amp; Learning Preferences
                  </h2>
                  <p className="font-body text-xs text-[#7b7974]">
                    Configure your learning discipline, experience level, and study pacing.
                  </p>
                </div>
                {!isEditingStudent && (
                  <button
                    type="button"
                    onClick={() => setIsEditingStudent(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#efeeeb] hover:bg-[#e7e6e1] text-[#121212] text-xs font-medium cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit Profile</span>
                  </button>
                )}
              </div>

              {isEditingStudent ? (
                <form onSubmit={handleStudentSave} className="flex flex-col gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-[#121212]">Primary Area of Study</label>
                    <input
                      type="text"
                      required
                      value={studentDiscipline}
                      onChange={e => setStudentDiscipline(e.target.value)}
                      placeholder="e.g., Computer Science & Software Engineering"
                      className="px-3.5 py-2.5 rounded-xl bg-[#f8f8f6] text-[#121212] text-xs sm:text-sm font-body border border-[#e7e6e1] focus:bg-[#ffffff] focus:border-[#121212] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-[#121212]">Experience Level</label>
                      <select
                        value={studentDegree}
                        onChange={e => setStudentDegree(e.target.value)}
                        className="px-3.5 py-2.5 rounded-xl bg-[#f8f8f6] text-[#121212] text-xs sm:text-sm font-body border border-[#e7e6e1] focus:bg-[#ffffff] focus:border-[#121212] focus:outline-none"
                      >
                        <option value="Beginner Student">Beginner Student</option>
                        <option value="Intermediate Learner">Intermediate Learner</option>
                        <option value="Advanced / Graduate">Advanced / Graduate</option>
                        <option value="Professional Engineer">Professional Engineer</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-[#121212]">Study Pacing Preference</label>
                      <select
                        value={studentPacing}
                        onChange={e => setStudentPacing(e.target.value)}
                        className="px-3.5 py-2.5 rounded-xl bg-[#f8f8f6] text-[#121212] text-xs sm:text-sm font-body border border-[#e7e6e1] focus:bg-[#ffffff] focus:border-[#121212] focus:outline-none"
                      >
                        <option value="Self-Paced Flexible">Self-Paced Flexible</option>
                        <option value="Structured Weekly">Structured Weekly</option>
                        <option value="Accelerated">Accelerated</option>
                      </select>
                    </div>
                  </div>

                  {/* Research Tags */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-[#121212]">Core Research Areas &amp; Subject Tags</label>
                    <div className="flex items-center gap-1.5 flex-wrap p-2 rounded-xl bg-[#f8f8f6] border border-[#e7e6e1]">
                      {studentTags.map(t => (
                        <span key={t} className="px-2 py-0.5 rounded-md bg-[#ffffff] border border-[#e7e6e1] text-[#121212] font-mono text-[11px] flex items-center gap-1">
                          {t}
                          <button
                            type="button"
                            onClick={() => setStudentTags(studentTags.filter(item => item !== t))}
                            className="text-[#9c9a92] hover:text-[#ba1a1a]"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                      <input
                        type="text"
                        value={newTagInput}
                        onChange={e => setNewTagInput(e.target.value)}
                        onKeyDown={handleAddStudentTag}
                        placeholder="+ tag (press Enter)"
                        className="bg-transparent font-mono text-[11px] text-[#121212] outline-none px-1 w-28 placeholder:text-[#9c9a92]"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#e7e6e1]">
                    <button
                      type="button"
                      onClick={() => setIsEditingStudent(false)}
                      className="px-4 py-2 rounded-lg text-xs font-medium text-[#7b7974] hover:bg-[#efeeeb]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-lg bg-[#121212] hover:bg-black text-[#f8f8f6] text-xs font-medium shadow-xs"
                    >
                      Save Scholar Folio
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex flex-col gap-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-3.5 rounded-xl bg-[#f8f8f6] border border-[#e7e6e1] flex flex-col">
                      <span className="font-mono text-[10px] uppercase text-[#7b7974] font-semibold">Specialization Track</span>
                      <span className="font-body text-xs sm:text-sm font-semibold text-[#121212] mt-0.5">{studentDiscipline}</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#f8f8f6] border border-[#e7e6e1] flex flex-col">
                      <span className="font-mono text-[10px] uppercase text-[#7b7974] font-semibold">Scholarship Tier</span>
                      <span className="font-body text-xs sm:text-sm font-semibold text-[#121212] mt-0.5">{studentDegree}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <span className="font-mono text-[10px] uppercase text-[#7b7974] font-semibold">Study Focus Areas</span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {studentTags.map(t => (
                        <span key={t} className="px-2.5 py-1 rounded-lg bg-[#efeeeb] text-[#121212] font-mono text-[11px] font-medium border border-[#e7e6e1]">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#eaf4ea]/60 border border-[#4b7a47]/20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#4b7a47] shrink-0" />
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-[#121212]">Enrollment Status</span>
                        <span className="text-[11px] text-[#7b7974]">Eligible for course certificates, quizzes, and project evaluations</span>
                      </div>
                    </div>
                    <Link
                      to="/learn"
                      className="px-3.5 py-1.5 rounded-lg bg-[#121212] text-[#f8f8f6] hover:bg-black font-body text-xs font-medium"
                    >
                      Go to My Learning →
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ──── INSTRUCTOR ROLE SPECIFIC FIELDS ──── */}
          {isInstructor && (
            <div className="bg-[#ffffff] rounded-2xl p-6 sm:p-8 border border-[#e7e6e1] shadow-xs flex flex-col gap-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#e7e6e1]">
                <div className="flex flex-col">
                  <h2 className="font-heading text-xl sm:text-2xl text-[#121212] font-normal">
                    Instructor Profile &amp; Verification
                  </h2>
                  <p className="font-body text-xs text-[#7b7974]">
                    Manage your instructor credentials, verification status, and teaching expertise.
                  </p>
                </div>
                {!isEditingInstructor && (
                  <button
                    type="button"
                    onClick={() => setIsEditingInstructor(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#efeeeb] hover:bg-[#e7e6e1] text-[#121212] text-xs font-medium cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit Profile</span>
                  </button>
                )}
              </div>

              {/* Verification Status Card */}
              <div className="p-4 rounded-xl bg-[#f8f8f6] border border-[#e7e6e1] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#ffffff] border border-[#e7e6e1] flex items-center justify-center text-[#d97757] shadow-xs shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-[#121212]">Instructor Verification</span>
                    <span className="font-mono text-[11px] text-[#7b7974]">
                      Current Status: <strong className="text-[#121212] font-bold">{instructorProfile?.verificationStatus || 'UNVERIFIED'}</strong>
                    </span>
                  </div>
                </div>

                {(instructorProfile?.verificationStatus === 'UNVERIFIED' || instructorProfile?.verificationStatus === 'REJECTED') && (
                  <button
                    type="button"
                    onClick={() => requestVerification.mutate()}
                    disabled={requestVerification.isPending}
                    className="px-4 py-2 rounded-lg bg-[#d97757] hover:bg-[#c26243] text-[#ffffff] font-body text-xs font-medium transition-all shadow-xs disabled:opacity-50"
                  >
                    {requestVerification.isPending ? 'Requesting...' : 'Request Verification'}
                  </button>
                )}

                {instructorProfile?.verificationStatus === 'VERIFIED' && (
                  <span className="inline-flex items-center gap-1 text-xs font-mono font-semibold text-[#4b7a47]">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Verified Instructor</span>
                  </span>
                )}

                {instructorProfile?.verificationStatus === 'PENDING' && (
                  <span className="inline-flex items-center gap-1 text-xs font-mono font-semibold text-[#8c501e]">
                    <Clock className="w-4 h-4" />
                    <span>Verification in Review</span>
                  </span>
                )}
              </div>

              {isEditingInstructor ? (
                <form onSubmit={handleInstructorSave} className="flex flex-col gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-[#121212]">
                      Instructor Biography &amp; Background
                    </label>
                    <textarea
                      rows={4}
                      value={bio}
                      onChange={e => setBio(e.target.value)}
                      placeholder="Tell learners about your background, experience, and teaching areas..."
                      className="px-3.5 py-2.5 rounded-xl bg-[#f8f8f6] text-[#121212] text-xs sm:text-sm font-body border border-[#e7e6e1] focus:bg-[#ffffff] focus:border-[#121212] focus:outline-none leading-relaxed"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-[#121212]">
                      Areas of Expertise
                    </label>
                    <input
                      type="text"
                      value={expertise}
                      onChange={e => setExpertise(e.target.value)}
                      placeholder="e.g., Web Development, Python, Cloud Architecture"
                      className="px-3.5 py-2.5 rounded-xl bg-[#f8f8f6] text-[#121212] text-xs sm:text-sm font-body border border-[#e7e6e1] focus:bg-[#ffffff] focus:border-[#121212] focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#e7e6e1]">
                    <button
                      type="button"
                      onClick={() => setIsEditingInstructor(false)}
                      className="px-4 py-2 rounded-lg text-xs font-medium text-[#7b7974] hover:bg-[#efeeeb]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={updateInstructorProfile.isPending}
                      className="px-5 py-2 rounded-lg bg-[#121212] hover:bg-black text-[#f8f8f6] text-xs font-medium shadow-xs disabled:opacity-50"
                    >
                      {updateInstructorProfile.isPending ? 'Saving...' : 'Save Instructor Profile'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex flex-col gap-5">
                  <div className="flex flex-col gap-1">
                    <span className="font-mono text-[10px] uppercase text-[#7b7974] font-semibold">Instructor Biography</span>
                    <p className="font-body text-xs sm:text-sm text-[#121212] leading-relaxed p-3.5 rounded-xl bg-[#f8f8f6] border border-[#e7e6e1]">
                      {instructorProfile?.bio || 'No instructor bio provided yet. Click "Edit Profile" to add your bio.'}
                    </p>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="font-mono text-[10px] uppercase text-[#7b7974] font-semibold">Areas of Expertise</span>
                    <div className="p-3.5 rounded-xl bg-[#f8f8f6] border border-[#e7e6e1] text-xs font-mono text-[#373734]">
                      {instructorProfile?.expertise || 'Distributed Systems, Autonomous AI, Kernel Engineering'}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ──── ADMIN ROLE SPECIFIC FIELDS ──── */}
          {isAdmin && (
            <div className="bg-[#ffffff] rounded-2xl p-6 sm:p-8 border border-[#e7e6e1] shadow-xs flex flex-col gap-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#e7e6e1]">
                <div className="flex flex-col">
                  <h2 className="font-heading text-xl sm:text-2xl text-[#121212] font-normal">
                    Platform Administration &amp; Moderation
                  </h2>
                  <p className="font-body text-xs text-[#7b7974]">
                    Instructor review, course approval, user moderation, and platform management.
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded bg-[#121212] text-[#f8f8f6] font-mono text-[10px] font-bold">
                  ADMINISTRATOR
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#f8f8f6] border border-[#e7e6e1] flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-[#d97757] shrink-0 mt-0.5" />
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-[#121212]">Instructor Verification</span>
                    <span className="text-[11px] text-[#7b7974]">Review and approve incoming instructor applications</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#f8f8f6] border border-[#e7e6e1] flex items-start gap-3">
                  <BookOpen className="w-5 h-5 text-[#d97757] shrink-0 mt-0.5" />
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-[#121212]">Course Moderation</span>
                    <span className="text-[11px] text-[#7b7974]">Review and publish staged courses across catalog</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#f8f8f6] border border-[#e7e6e1] flex items-start gap-3">
                  <User className="w-5 h-5 text-[#d97757] shrink-0 mt-0.5" />
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-[#121212]">User Management</span>
                    <span className="text-[11px] text-[#7b7974]">Manage student and instructor accounts and roles</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#f8f8f6] border border-[#e7e6e1] flex items-start gap-3">
                  <Award className="w-5 h-5 text-[#d97757] shrink-0 mt-0.5" />
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-[#121212]">Financial &amp; Sales Oversight</span>
                    <span className="text-[11px] text-[#7b7974]">Monitor platform transactions and instructor payouts</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#121212] text-[#f8f8f6] flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xs font-semibold">Admin Dashboard Ready</span>
                  <span className="font-mono text-[10px] text-[#9c9a92]">Manage courses, instructors, and reports</span>
                </div>
                <Link
                  to="/admin"
                  className="px-4 py-2 rounded-lg bg-[#ffffff] text-[#121212] hover:bg-[#efeeeb] font-body text-xs font-medium"
                >
                  Open Admin Dashboard →
                </Link>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: EMAIL & NOTIFICATIONS                                   */}
      {/* ============================================================== */}
      {activeTab === 'dispatches' && (
        <div className="bg-[#ffffff] rounded-2xl p-6 sm:p-8 border border-[#e7e6e1] shadow-xs max-w-3xl mx-auto w-full flex flex-col gap-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#e7e6e1]">
            <div className="flex flex-col">
              <h2 className="font-heading text-xl sm:text-2xl text-[#121212] font-normal">
                Email Notifications &amp; Communication
              </h2>
              <p className="font-body text-xs text-[#7b7974]">
                Choose how Lumina communicates course updates, assignment feedback, and announcements.
              </p>
            </div>
            <Bell className="w-5 h-5 text-[#d97757]" />
          </div>

          {prefSaveSuccess && (
            <div className="p-3.5 rounded-xl bg-[#eaf4ea] text-[#245222] border border-[#4b7a47]/20 flex items-center justify-between text-xs font-medium">
              <span>Notification preferences saved successfully.</span>
              <Check className="w-4 h-4 text-[#4b7a47]" />
            </div>
          )}

          {/* Toggle Switch */}
          <div className="flex items-start justify-between gap-4 p-4 rounded-xl bg-[#f8f8f6] border border-[#e7e6e1]">
            <div className="flex flex-col gap-1">
              <span className="text-xs sm:text-sm font-semibold text-[#121212]">
                Course &amp; Platform Email Notifications
              </span>
              <p className="font-body text-xs text-[#7b7974] leading-relaxed">
                Receive important email updates regarding course milestones, quiz grades, and instructor messages.
              </p>
            </div>

            <button
              type="button"
              onClick={handleToggleEmailPrefs}
              disabled={updateEmailPrefs.isPending || prefsLoading}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                emailEnabled ? 'bg-[#121212]' : 'bg-[#e7e6e1]'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  emailEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Granular Sub-options */}
          <div className="flex flex-col gap-3">
            <span className="font-mono text-[11px] uppercase tracking-wider text-[#7b7974] font-semibold">
              Notification Topics
            </span>

            <div className="flex items-center justify-between p-3 rounded-lg border border-[#e7e6e1] text-xs">
              <span className="text-[#373734]">Assignment Reviews &amp; Quiz Grades</span>
              <span className="font-mono text-[10px] text-[#4b7a47] font-semibold">ENABLED</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border border-[#e7e6e1] text-xs">
              <span className="text-[#373734]">Course Updates &amp; New Lessons</span>
              <span className="font-mono text-[10px] text-[#4b7a47] font-semibold">ENABLED</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border border-[#e7e6e1] text-xs">
              <span className="text-[#373734]">Instructor Announcements &amp; Q&amp;A</span>
              <span className="font-mono text-[10px] text-[#4b7a47] font-semibold">ENABLED</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border border-[#e7e6e1] text-xs">
              <span className="text-[#373734]">Syllabus Updates &amp; Transcoded Lecture Releases</span>
              <span className="font-mono text-[10px] text-[#4b7a47] font-semibold">ENABLED</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border border-[#e7e6e1] text-xs">
              <span className="text-[#373734]">Faculty Office Hours &amp; Live Seminars</span>
              <span className="font-mono text-[10px] text-[#4b7a47] font-semibold">ENABLED</span>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 4: SECURITY & ACTIVE SESSION                               */}
      {/* ============================================================== */}
      {activeTab === 'security' && (
        <div className="bg-[#ffffff] rounded-2xl p-6 sm:p-8 border border-[#e7e6e1] shadow-xs max-w-3xl mx-auto w-full flex flex-col gap-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#e7e6e1]">
            <div className="flex flex-col">
              <h2 className="font-heading text-xl sm:text-2xl text-[#121212] font-normal">
                Security &amp; Account Access
              </h2>
              <p className="font-body text-xs text-[#7b7974]">
                Account security, authentication credentials, and active login sessions.
              </p>
            </div>
            <Key className="w-5 h-5 text-[#d97757]" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-xl bg-[#f8f8f6] border border-[#e7e6e1] flex flex-col">
              <span className="font-mono text-[10px] uppercase text-[#7b7974] font-semibold">Authentication</span>
              <span className="font-mono text-xs text-[#121212] mt-0.5">Secure JWT Token</span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#f8f8f6] border border-[#e7e6e1] flex flex-col">
              <span className="font-mono text-[10px] uppercase text-[#7b7974] font-semibold">Account Role</span>
              <span className="font-mono text-xs text-[#121212] mt-0.5">{user.role}</span>
            </div>
          </div>

          {/* Session Termination Button */}
          <div className="p-4 rounded-xl bg-[#ffdad6]/40 border border-[#ba1a1a]/20 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-[#93000a]">Sign Out</span>
              <span className="font-body text-[11px] text-[#7b7974]">Sign out from this device and end your active session.</span>
            </div>
            <button
              type="button"
              onClick={logout}
              className="px-4 py-2 rounded-lg bg-[#ba1a1a] hover:bg-[#93000a] text-[#ffffff] font-body text-xs font-medium transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
