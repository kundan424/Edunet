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
  Building,
  ChevronRight
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
      badgeBg: 'bg-wash',
      badgeText: 'text-ember',
      badgeBorder: 'border-rule',
      folioPrefix: 'EDUNET-STUDENT',
      description: 'Enrolled in academic curricula, interactive video lessons, quizzes, and project evaluations.'
    },
    INSTRUCTOR: {
      title: 'Course Instructor',
      shortTitle: 'Instructor',
      badgeBg: 'bg-wash',
      badgeText: 'text-ember',
      badgeBorder: 'border-rule',
      folioPrefix: 'EDUNET-FACULTY',
      description: 'Authorized to publish courses, design curriculum syllabi, and grade student assignments.'
    },
    ADMIN: {
      title: 'Platform Administrator',
      shortTitle: 'Administrator',
      badgeBg: 'bg-wash',
      badgeText: 'text-ember',
      badgeBorder: 'border-rule',
      folioPrefix: 'EDUNET-ADMIN',
      description: 'Platform management: review submitted courses, manage users, and platform settings.'
    }
  }[role];

  return (
    <div className="flex flex-col w-full max-w-[1360px] mx-auto pb-20 text-foreground bg-canvas">
      {/* ── Breadcrumb & Context ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-6 border-b border-rule text-xs font-sans text-muted">
        <div className="flex items-center gap-2 flex-wrap">
          <Link to="/" className="hover:text-ember transition-colors">Edunet</Link>
          <ChevronRight className="w-3.5 h-3.5 text-muted" />
          <span>Profile &amp; Settings</span>
          <ChevronRight className="w-3.5 h-3.5 text-muted" />
          <span className="text-foreground font-medium">{user.name}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted">
          <span>Account ID:</span>
          <span className="bg-wash text-ember border border-rule px-2.5 py-0.5 rounded-full text-[11px] font-medium">
            {roleDisplay.folioPrefix}-{user.id.slice(0, 8).toUpperCase()}
          </span>
        </div>
      </div>

      {/* ── Main Scholar Identity Header Card ── */}
      <div className="bg-card rounded-[10px] p-6 sm:p-7 border border-rule shadow-none mb-8 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Left Avatar & Identity */}
          <div className="flex items-start sm:items-center gap-5">
            {/* Monogram Seal Avatar */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-[10px] bg-wash text-ember border border-rule flex items-center justify-center font-sans text-2xl sm:text-3xl font-semibold shrink-0">
              {user.name.charAt(0).toUpperCase()}
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="font-sans text-2xl sm:text-3xl text-foreground font-semibold tracking-[-0.015em]">
                  {user.name}
                </h1>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${roleDisplay.badgeBg} ${roleDisplay.badgeText} border ${roleDisplay.badgeBorder} text-xs font-medium`}>
                  {roleDisplay.shortTitle}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#ECFDF5] text-[#16A34A] border border-[#A7F3D0] text-xs font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
                  <span>Account Active</span>
                </span>
              </div>

              <div className="flex items-center gap-4 text-xs font-sans text-muted flex-wrap pt-0.5">
                <span className="flex items-center gap-1.5 text-muted">
                  <Mail className="w-3.5 h-3.5 text-muted" />
                  <span>{user.email}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-muted">
                  <Building className="w-3.5 h-3.5 text-muted" />
                  <span>Edunet Learning Platform</span>
                </span>
              </div>

              <p className="font-sans text-xs sm:text-sm text-muted max-w-2xl pt-1 leading-relaxed">
                {roleDisplay.description}
              </p>
            </div>
          </div>

          {/* Quick Context Action */}
          <div className="flex items-center gap-2 self-start md:self-auto shrink-0 flex-wrap">
            {isStudent && (
              <Link
                to="/learn"
                className="px-5 py-2.5 rounded-lg bg-ember text-white hover:bg-ember/90 font-sans text-xs sm:text-sm font-medium transition-colors flex items-center gap-1.5"
              >
                <BookOpen className="w-4 h-4 text-white" />
                <span>My Learning</span>
              </Link>
            )}

            {isInstructor && (
              <Link
                to="/instructor/courses"
                className="px-5 py-2.5 rounded-lg bg-ember text-white hover:bg-ember/90 font-sans text-xs sm:text-sm font-medium transition-colors flex items-center gap-1.5"
              >
                <Layers className="w-4 h-4 text-white" />
                <span>Course Studio</span>
              </Link>
            )}

            {isAdmin && (
              <Link
                to="/admin"
                className="px-5 py-2.5 rounded-lg bg-ember text-white hover:bg-ember/90 font-sans text-xs sm:text-sm font-medium transition-colors flex items-center gap-1.5"
              >
                <Shield className="w-4 h-4 text-white" />
                <span>Admin Dashboard</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ── Navigation Tab Bar ── */}
      <div className="flex items-center gap-1.5 bg-wash p-1.5 rounded-[10px] max-w-fit border border-rule shadow-none mb-8 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-sans font-medium transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'overview'
              ? 'bg-white text-ember border border-rule'
              : 'text-muted hover:text-foreground'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Profile Overview</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('role_folio')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-sans font-medium transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'role_folio'
              ? 'bg-white text-ember border border-rule'
              : 'text-muted hover:text-foreground'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>
            {isStudent && 'Learning Preferences & Track'}
            {isInstructor && 'Instructor Bio & Verification'}
            {isAdmin && 'Administration & Moderation'}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('dispatches')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-sans font-medium transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'dispatches'
              ? 'bg-white text-ember border border-rule'
              : 'text-muted hover:text-foreground'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Email &amp; Notifications</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-sans font-medium transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'security'
              ? 'bg-white text-ember border border-rule'
              : 'text-muted hover:text-foreground'
          }`}
        >
          <Key className="w-4 h-4" />
          <span>Security &amp; Session</span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* TAB 1: PROFILE OVERVIEW                                        */}
      {/* ============================================================== */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Left Column: Core Credentials Form & Role Metadata */}
          <div className="md:col-span-8 flex flex-col gap-6">
            <div className="bg-card rounded-[10px] p-6 sm:p-7 border border-rule shadow-none flex flex-col gap-6">
              <div className="flex items-center justify-between pb-4 border-b border-rule">
                <div className="flex flex-col">
                  <h2 className="font-sans text-lg sm:text-xl text-foreground font-semibold">
                    User Profile &amp; Account Details
                  </h2>
                  <span className="font-sans text-xs text-muted">
                    Your verified Edunet student profile
                  </span>
                </div>
                <span className="text-xs font-sans text-[#16A34A] font-medium bg-[#ECFDF5] px-2.5 py-0.5 rounded-full border border-[#A7F3D0]">
                  Active
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1 p-4 rounded-lg bg-canvas border border-rule">
                  <span className="text-xs font-sans text-muted font-medium">Full Name</span>
                  <span className="font-sans text-sm font-semibold text-foreground">{user.name}</span>
                </div>

                <div className="flex flex-col gap-1 p-4 rounded-lg bg-canvas border border-rule">
                  <span className="text-xs font-sans text-muted font-medium">Email Address</span>
                  <span className="font-sans text-sm font-semibold text-foreground">{user.email}</span>
                </div>

                <div className="flex flex-col gap-1 p-4 rounded-lg bg-canvas border border-rule">
                  <span className="text-xs font-sans text-muted font-medium">Role</span>
                  <span className="font-sans text-sm font-semibold text-foreground">{roleDisplay.title}</span>
                </div>

                <div className="flex flex-col gap-1 p-4 rounded-lg bg-canvas border border-rule">
                  <span className="text-xs font-sans text-muted font-medium">User ID</span>
                  <span className="font-sans text-xs text-muted font-medium">{user.id}</span>
                </div>
              </div>

              {/* Quick Role Specific Summary inside Overview */}
              {isStudent && (
                <div className="p-4 rounded-lg bg-wash border border-rule flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-ember shrink-0" />
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-foreground">Learning Discipline</span>
                      <span className="text-xs text-muted">{studentDiscipline}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('role_folio')}
                    className="text-xs font-sans text-ember hover:text-[#3730A3] font-medium"
                  >
                    Edit Preferences →
                  </button>
                </div>
              )}

              {isInstructor && instructorProfile && (
                <div className="p-4 rounded-lg bg-wash border border-rule flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-ember" />
                      <span>Instructor Biography &amp; Background</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveTab('role_folio')}
                      className="text-xs font-sans text-ember hover:text-[#3730A3] font-medium"
                    >
                      Update Bio →
                    </button>
                  </div>
                  <p className="text-xs font-sans text-muted line-clamp-2 leading-relaxed">
                    {instructorProfile.bio || 'No instructor bio added yet. Click to define your professional background.'}
                  </p>
                </div>
              )}

              {isAdmin && (
                <div className="p-4 rounded-lg bg-wash border border-rule flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-ember shrink-0" />
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-foreground">Platform Administration</span>
                      <span className="text-xs text-muted">Full administrator permissions &amp; course moderation</span>
                    </div>
                  </div>
                  <Link
                    to="/admin"
                    className="text-xs font-sans text-ember hover:text-[#3730A3] font-medium"
                  >
                    Admin Console →
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Live Overview Metrics Card */}
          <div className="md:col-span-4 flex flex-col gap-6">
            {/* Student Stats */}
            {isStudent && (
              <div className="bg-card rounded-[10px] p-6 border border-rule shadow-none flex flex-col gap-4">
                <span className="font-sans text-base font-semibold text-foreground">Learning Overview</span>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-lg bg-canvas border border-rule flex flex-col">
                    <span className="font-sans text-2xl font-medium text-foreground">
                      {studentDashboard?.totalEnrolledCourses || 0}
                    </span>
                    <span className="text-xs text-muted">Enrolled</span>
                  </div>
                  <div className="p-3.5 rounded-lg bg-canvas border border-rule flex flex-col">
                    <span className="font-sans text-2xl font-medium text-foreground">
                      {studentDashboard?.completedCourses || 0}
                    </span>
                    <span className="text-xs text-muted">Completed</span>
                  </div>
                  <div className="p-3.5 rounded-lg bg-canvas border border-rule flex flex-col">
                    <span className="font-sans text-2xl font-medium text-foreground">
                      {studentDashboard?.quizzesPassed || 0}
                    </span>
                    <span className="text-xs text-muted">Quizzes</span>
                  </div>
                  <div className="p-3.5 rounded-lg bg-canvas border border-rule flex flex-col">
                    <span className="font-sans text-2xl font-medium text-ember">
                      {studentDashboard?.overallCourseCompletionPercentage || 0}%
                    </span>
                    <span className="text-xs text-muted">Progress</span>
                  </div>
                </div>
              </div>
            )}

            {/* Instructor Stats */}
            {isInstructor && (
              <div className="bg-card rounded-[10px] p-6 border border-rule shadow-none flex flex-col gap-4">
                <span className="font-sans text-base font-semibold text-foreground">Faculty Metrics</span>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-lg bg-canvas border border-rule flex flex-col">
                    <span className="font-sans text-2xl font-medium text-foreground">
                      {instructorDashboard?.totalCoursesOwned || 0}
                    </span>
                    <span className="text-xs text-muted">Authored</span>
                  </div>
                  <div className="p-3.5 rounded-lg bg-canvas border border-rule flex flex-col">
                    <span className="font-sans text-2xl font-medium text-foreground">
                      {instructorDashboard?.totalEnrolledStudents || 0}
                    </span>
                    <span className="text-xs text-muted">Learners</span>
                  </div>
                  <div className="p-3.5 rounded-lg bg-canvas border border-rule flex flex-col">
                    <span className="font-sans text-2xl font-medium text-ember">
                      ★ {instructorDashboard?.averageRating ? instructorDashboard.averageRating.toFixed(1) : '5.0'}
                    </span>
                    <span className="text-xs text-muted">Rating</span>
                  </div>
                  <div className="p-3.5 rounded-lg bg-canvas border border-rule flex flex-col">
                    <span className="font-sans text-2xl font-medium text-foreground">
                      {instructorDashboard?.publishedCourses || 0}
                    </span>
                    <span className="text-xs text-muted">Published</span>
                  </div>
                </div>
              </div>
            )}

            {/* Admin Stats */}
            {isAdmin && (
              <div className="bg-card rounded-[10px] p-6 border border-rule shadow-none flex flex-col gap-4">
                <span className="font-sans text-base font-semibold text-foreground">Platform Governance</span>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-lg bg-canvas border border-rule flex flex-col">
                    <span className="font-sans text-2xl font-medium text-foreground">
                      {adminDashboard?.users?.total || 0}
                    </span>
                    <span className="text-xs text-muted">Total Users</span>
                  </div>
                  <div className="p-3.5 rounded-lg bg-canvas border border-rule flex flex-col">
                    <span className="font-sans text-2xl font-medium text-foreground">
                      {adminDashboard?.courses?.total || 0}
                    </span>
                    <span className="text-xs text-muted">Curricula</span>
                  </div>
                  <div className="p-3.5 rounded-lg bg-canvas border border-rule flex flex-col">
                    <span className="font-sans text-2xl font-medium text-ember">
                      {adminDashboard?.courses?.pendingApproval || 0}
                    </span>
                    <span className="text-xs text-muted">Reviews</span>
                  </div>
                  <div className="p-3.5 rounded-lg bg-canvas border border-rule flex flex-col">
                    <span className="font-sans text-2xl font-medium text-foreground">
                      {adminDashboard?.instructors?.pending || 0}
                    </span>
                    <span className="text-xs text-muted">Faculty Apps</span>
                  </div>
                </div>
              </div>
            )}

            {/* Platform Assurance Card */}
            <div className="p-5 rounded-[10px] bg-card border border-rule shadow-none flex flex-col gap-2">
              <span className="text-xs font-semibold text-foreground">
                Platform Security &amp; Records
              </span>
              <p className="font-sans text-xs text-muted leading-relaxed">
                All records, quiz scores, and course completions are recorded securely and updated in real-time on your Edunet account.
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
            <div className="bg-card rounded-[10px] p-6 sm:p-8 border border-rule shadow-none flex flex-col gap-6">
              <div className="flex items-center justify-between pb-4 border-b border-rule">
                <div className="flex flex-col">
                  <h2 className="font-sans text-xl sm:text-2xl text-foreground font-semibold">
                    Student Profile &amp; Learning Preferences
                  </h2>
                  <p className="font-sans text-xs text-muted">
                    Configure your learning discipline, experience level, and study pacing.
                  </p>
                </div>
                {!isEditingStudent && (
                  <button
                    type="button"
                    onClick={() => setIsEditingStudent(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-card hover:bg-canvas text-foreground border border-rule text-xs font-medium cursor-pointer transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-ember" />
                    <span>Edit Profile</span>
                  </button>
                )}
              </div>

              {isEditingStudent ? (
                <form onSubmit={handleStudentSave} className="flex flex-col gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-foreground">Primary Area of Study</label>
                    <input
                      type="text"
                      required
                      value={studentDiscipline}
                      onChange={e => setStudentDiscipline(e.target.value)}
                      placeholder="e.g., Computer Science & Software Engineering"
                      className="px-4 py-2.5 rounded-lg bg-canvas text-foreground text-xs sm:text-sm font-sans border border-rule focus:bg-white focus:border-ember focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-foreground">Experience Level</label>
                      <select
                        value={studentDegree}
                        onChange={e => setStudentDegree(e.target.value)}
                        className="px-4 py-2.5 rounded-lg bg-canvas text-foreground text-xs sm:text-sm font-sans border border-rule focus:bg-white focus:border-ember focus:outline-none"
                      >
                        <option value="Beginner Student">Beginner Student</option>
                        <option value="Intermediate Learner">Intermediate Learner</option>
                        <option value="Advanced / Graduate">Advanced / Graduate</option>
                        <option value="Professional Engineer">Professional Engineer</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-foreground">Study Pacing Preference</label>
                      <select
                        value={studentPacing}
                        onChange={e => setStudentPacing(e.target.value)}
                        className="px-4 py-2.5 rounded-lg bg-canvas text-foreground text-xs sm:text-sm font-sans border border-rule focus:bg-white focus:border-ember focus:outline-none"
                      >
                        <option value="Self-Paced Flexible">Self-Paced Flexible</option>
                        <option value="Structured Weekly">Structured Weekly</option>
                        <option value="Accelerated">Accelerated</option>
                      </select>
                    </div>
                  </div>

                  {/* Subject Tags */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-foreground">Core Subject Areas &amp; Skills</label>
                    <div className="flex items-center gap-2 flex-wrap p-3 rounded-lg bg-canvas border border-rule">
                      {studentTags.map(t => (
                        <span key={t} className="px-2.5 py-1 rounded-md bg-wash border border-rule text-ember text-xs font-medium flex items-center gap-1.5">
                          {t}
                          <button
                            type="button"
                            onClick={() => setStudentTags(studentTags.filter(item => item !== t))}
                            className="text-muted hover:text-[#DC2626]"
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
                        placeholder="+ add skill (Enter)"
                        className="bg-transparent text-xs text-foreground outline-none px-2 py-1 w-36 placeholder:text-muted"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-rule">
                    <button
                      type="button"
                      onClick={() => setIsEditingStudent(false)}
                      className="px-4 py-2 rounded-lg text-xs font-medium text-muted hover:bg-wash"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-lg bg-ember hover:bg-ember/90 text-white text-xs font-medium transition-colors"
                    >
                      Save Profile
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex flex-col gap-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-canvas border border-rule flex flex-col">
                      <span className="text-xs font-sans text-muted font-medium">Specialization Track</span>
                      <span className="text-sm font-semibold text-foreground mt-1">{studentDiscipline}</span>
                    </div>

                    <div className="p-4 rounded-lg bg-canvas border border-rule flex flex-col">
                      <span className="text-xs font-sans text-muted font-medium">Scholarship Tier</span>
                      <span className="text-sm font-semibold text-foreground mt-1">{studentDegree}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-sans text-muted font-medium">Study Focus Areas</span>
                    <div className="flex items-center gap-2 flex-wrap">
                      {studentTags.map(t => (
                        <span key={t} className="px-3 py-1 rounded-md bg-wash text-ember text-xs font-medium border border-rule">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#16A34A] shrink-0" />
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-foreground">Enrollment Status</span>
                        <span className="text-xs text-muted">Eligible for course certificates, quizzes, and project evaluations</span>
                      </div>
                    </div>
                    <Link
                      to="/learn"
                      className="px-4 py-2 rounded-lg bg-ember text-white hover:bg-ember/90 text-xs font-medium transition-colors"
                    >
                      My Learning →
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ──── INSTRUCTOR ROLE SPECIFIC FIELDS ──── */}
          {isInstructor && (
            <div className="bg-card rounded-[10px] p-6 sm:p-8 border border-rule shadow-none flex flex-col gap-6">
              <div className="flex items-center justify-between pb-4 border-b border-rule">
                <div className="flex flex-col">
                  <h2 className="font-sans text-xl sm:text-2xl text-foreground font-semibold">
                    Instructor Profile &amp; Verification
                  </h2>
                  <p className="font-sans text-xs text-muted">
                    Manage your instructor credentials, verification status, and teaching expertise.
                  </p>
                </div>
                {!isEditingInstructor && (
                  <button
                    type="button"
                    onClick={() => setIsEditingInstructor(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-card hover:bg-canvas text-foreground border border-rule text-xs font-medium cursor-pointer transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-ember" />
                    <span>Edit Profile</span>
                  </button>
                )}
              </div>

              {/* Verification Status Card */}
              <div className="p-4 rounded-lg bg-canvas border border-rule flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-wash border border-rule flex items-center justify-center text-ember shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-foreground">Instructor Verification</span>
                    <span className="text-xs text-muted">
                      Current Status: <strong className="text-foreground font-semibold">{instructorProfile?.verificationStatus || 'UNVERIFIED'}</strong>
                    </span>
                  </div>
                </div>

                {(instructorProfile?.verificationStatus === 'UNVERIFIED' || instructorProfile?.verificationStatus === 'REJECTED') && (
                  <button
                    type="button"
                    onClick={() => requestVerification.mutate()}
                    disabled={requestVerification.isPending}
                    className="px-4 py-2 rounded-lg bg-ember hover:bg-ember/90 text-white text-xs font-medium transition-colors disabled:opacity-50"
                  >
                    {requestVerification.isPending ? 'Requesting...' : 'Request Verification'}
                  </button>
                )}

                {instructorProfile?.verificationStatus === 'VERIFIED' && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#16A34A] bg-[#ECFDF5] px-3 py-1 rounded-full border border-[#A7F3D0]">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Verified Instructor</span>
                  </span>
                )}

                {instructorProfile?.verificationStatus === 'PENDING' && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#D97706] bg-wash px-3 py-1 rounded-full border border-[#FDE68A]">
                    <Clock className="w-4 h-4" />
                    <span>Verification in Review</span>
                  </span>
                )}
              </div>

              {isEditingInstructor ? (
                <form onSubmit={handleInstructorSave} className="flex flex-col gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Instructor Biography &amp; Background
                    </label>
                    <textarea
                      rows={4}
                      value={bio}
                      onChange={e => setBio(e.target.value)}
                      placeholder="Tell learners about your background, experience, and teaching areas..."
                      className="px-4 py-2.5 rounded-lg bg-canvas text-foreground text-xs sm:text-sm font-sans border border-rule focus:bg-white focus:border-ember focus:outline-none leading-relaxed"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Areas of Expertise
                    </label>
                    <input
                      type="text"
                      value={expertise}
                      onChange={e => setExpertise(e.target.value)}
                      placeholder="e.g., Web Development, Python, Cloud Architecture"
                      className="px-4 py-2.5 rounded-lg bg-canvas text-foreground text-xs sm:text-sm font-sans border border-rule focus:bg-white focus:border-ember focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-rule">
                    <button
                      type="button"
                      onClick={() => setIsEditingInstructor(false)}
                      className="px-4 py-2 rounded-lg text-xs font-medium text-muted hover:bg-wash"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={updateInstructorProfile.isPending}
                      className="px-5 py-2 rounded-lg bg-ember hover:bg-ember/90 text-white text-xs font-medium disabled:opacity-50 transition-colors"
                    >
                      {updateInstructorProfile.isPending ? 'Saving...' : 'Save Profile'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex flex-col gap-5">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-sans text-muted font-medium">Instructor Biography</span>
                    <p className="text-xs sm:text-sm text-foreground leading-relaxed p-4 rounded-lg bg-canvas border border-rule">
                      {instructorProfile?.bio || 'No instructor bio provided yet. Click "Edit Profile" to add your bio.'}
                    </p>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-sans text-muted font-medium">Areas of Expertise</span>
                    <div className="p-4 rounded-lg bg-canvas border border-rule text-xs text-muted">
                      {instructorProfile?.expertise || 'Distributed Systems, Autonomous AI, Kernel Engineering'}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ──── ADMIN ROLE SPECIFIC FIELDS ──── */}
          {isAdmin && (
            <div className="bg-card rounded-[10px] p-6 sm:p-8 border border-rule shadow-none flex flex-col gap-6">
              <div className="flex items-center justify-between pb-4 border-b border-rule">
                <div className="flex flex-col">
                  <h2 className="font-sans text-xl sm:text-2xl text-foreground font-semibold">
                    Platform Administration &amp; Moderation
                  </h2>
                  <p className="font-sans text-xs text-muted">
                    Instructor review, course approval, user moderation, and platform management.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-wash text-ember border border-rule text-xs font-medium">
                  Administrator
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-canvas border border-rule flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-ember shrink-0 mt-0.5" />
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-foreground">Instructor Verification</span>
                    <span className="text-xs text-muted">Review and approve incoming instructor applications</span>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-canvas border border-rule flex items-start gap-3">
                  <BookOpen className="w-5 h-5 text-ember shrink-0 mt-0.5" />
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-foreground">Course Moderation</span>
                    <span className="text-xs text-muted">Review and publish staged courses across catalog</span>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-canvas border border-rule flex items-start gap-3">
                  <User className="w-5 h-5 text-ember shrink-0 mt-0.5" />
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-foreground">User Management</span>
                    <span className="text-xs text-muted">Manage student and instructor accounts and roles</span>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-canvas border border-rule flex items-start gap-3">
                  <Award className="w-5 h-5 text-ember shrink-0 mt-0.5" />
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-foreground">Financial &amp; Sales Oversight</span>
                    <span className="text-xs text-muted">Monitor platform transactions and instructor payouts</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-ember text-white flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xs font-semibold">Admin Dashboard Ready</span>
                  <span className="text-[11px] text-[#C7D2FE]">Manage courses, instructors, and reports</span>
                </div>
                <Link
                  to="/admin"
                  className="px-4 py-2 rounded-lg bg-white text-ember hover:bg-wash text-xs font-medium transition-colors"
                >
                  Open Dashboard →
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
        <div className="bg-card rounded-[10px] p-6 sm:p-8 border border-rule shadow-none max-w-3xl mx-auto w-full flex flex-col gap-6">
          <div className="flex items-center justify-between pb-4 border-b border-rule">
            <div className="flex flex-col">
              <h2 className="font-sans text-xl sm:text-2xl text-foreground font-semibold">
                Email Notifications &amp; Communication
              </h2>
              <p className="font-sans text-xs text-muted">
                Choose how Edunet communicates course updates, assignment feedback, and announcements.
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-wash flex items-center justify-center text-ember">
              <Bell className="w-5 h-5 text-ember" />
            </div>
          </div>

          {prefSaveSuccess && (
            <div className="p-3.5 rounded-lg bg-[#ECFDF5] text-[#16A34A] border border-[#A7F3D0] flex items-center justify-between text-xs font-medium">
              <span>Notification preferences saved successfully.</span>
              <Check className="w-4 h-4 text-[#16A34A]" />
            </div>
          )}

          {/* Toggle Switch */}
          <div className="flex items-start justify-between gap-4 p-5 rounded-lg bg-canvas border border-rule">
            <div className="flex flex-col gap-1">
              <span className="text-xs sm:text-sm font-semibold text-foreground">
                Course &amp; Platform Email Notifications
              </span>
              <p className="font-sans text-xs text-muted leading-relaxed">
                Receive important email updates regarding course milestones, quiz grades, and instructor messages.
              </p>
            </div>

            <button
              type="button"
              onClick={handleToggleEmailPrefs}
              disabled={updateEmailPrefs.isPending || prefsLoading}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                emailEnabled ? 'bg-ember' : 'bg-[#CBD5E1]'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white ring-0 transition duration-200 ease-in-out ${
                  emailEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Notification Topics */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-sans text-muted font-medium">
              Notification Topics
            </span>

            <div className="flex items-center justify-between p-3.5 rounded-lg border border-rule text-xs">
              <span className="text-muted">Assignment Reviews &amp; Quiz Grades</span>
              <span className="text-xs text-[#16A34A] font-medium bg-[#ECFDF5] px-2.5 py-0.5 rounded-full border border-[#A7F3D0]">Enabled</span>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-lg border border-rule text-xs">
              <span className="text-muted">Course Updates &amp; New Lessons</span>
              <span className="text-xs text-[#16A34A] font-medium bg-[#ECFDF5] px-2.5 py-0.5 rounded-full border border-[#A7F3D0]">Enabled</span>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-lg border border-rule text-xs">
              <span className="text-muted">Instructor Announcements &amp; Q&amp;A</span>
              <span className="text-xs text-[#16A34A] font-medium bg-[#ECFDF5] px-2.5 py-0.5 rounded-full border border-[#A7F3D0]">Enabled</span>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-lg border border-rule text-xs">
              <span className="text-muted">Syllabus Updates &amp; Transcoded Lecture Releases</span>
              <span className="text-xs text-[#16A34A] font-medium bg-[#ECFDF5] px-2.5 py-0.5 rounded-full border border-[#A7F3D0]">Enabled</span>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-lg border border-rule text-xs">
              <span className="text-muted">Faculty Office Hours &amp; Live Seminars</span>
              <span className="text-xs text-[#16A34A] font-medium bg-[#ECFDF5] px-2.5 py-0.5 rounded-full border border-[#A7F3D0]">Enabled</span>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 4: SECURITY & ACTIVE SESSION                               */}
      {/* ============================================================== */}
      {activeTab === 'security' && (
        <div className="bg-card rounded-[10px] p-6 sm:p-8 border border-rule shadow-none max-w-3xl mx-auto w-full flex flex-col gap-6">
          <div className="flex items-center justify-between pb-4 border-b border-rule">
            <div className="flex flex-col">
              <h2 className="font-sans text-xl sm:text-2xl text-foreground font-semibold">
                Security &amp; Account Access
              </h2>
              <p className="font-sans text-xs text-muted">
                Account security, authentication credentials, and active login sessions.
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-wash flex items-center justify-center text-ember">
              <Key className="w-5 h-5 text-ember" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-canvas border border-rule flex flex-col">
              <span className="text-xs font-sans text-muted font-medium">Authentication</span>
              <span className="text-xs text-foreground font-semibold mt-1">Secure JWT Session</span>
            </div>

            <div className="p-4 rounded-lg bg-canvas border border-rule flex flex-col">
              <span className="text-xs font-sans text-muted font-medium">Account Role</span>
              <span className="text-xs text-foreground font-semibold mt-1">{user.role}</span>
            </div>
          </div>

          {/* Session Termination Button */}
          <div className="p-5 rounded-lg bg-[#FEF2F2] border border-[#FECACA] flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-[#DC2626]">Sign Out</span>
              <span className="font-sans text-xs text-muted">Sign out from this device and end your active session.</span>
            </div>
            <button
              type="button"
              onClick={logout}
              className="px-4 py-2 rounded-lg bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5"
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
