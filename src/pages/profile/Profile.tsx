import { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthProvider';
import { useInstructorProfile, useUpdateInstructorProfile, useRequestVerification } from '../../features/instructor/queries';
import { SectionHeading, BodyText } from '../../components/ui/Typography';
import { PillButton } from '../../components/ui/Button';
import { LoadingState } from '../../components/ui/States';
import { User, Briefcase, Shield, CheckCircle } from 'lucide-react';
import { Navigate } from 'react-router-dom';

export function Profile() {
  const { user } = useAuth();
  
  const { data: instructorProfile, isLoading: instructorLoading } = useInstructorProfile();
  const updateInstructorProfile = useUpdateInstructorProfile();
  const requestVerification = useRequestVerification();

  const [bio, setBio] = useState('');
  const [expertise, setExpertise] = useState('');
  const [isEditingInstructor, setIsEditingInstructor] = useState(false);

  useEffect(() => {
    if (instructorProfile) {
      setBio(instructorProfile.bio || '');
      setExpertise(instructorProfile.expertise || '');
    }
  }, [instructorProfile]);

  if (!user) return null;
  
  // Protect route if someone manually navigates here who isn't an instructor
  if (user.role !== 'INSTRUCTOR') {
    return <Navigate to="/" replace />;
  }

  if (instructorLoading) return <LoadingState message="Loading profile..." />;

  const handleInstructorSave = () => {
    updateInstructorProfile.mutate({ bio, expertise }, {
      onSuccess: () => setIsEditingInstructor(false)
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8 mt-4">
      <div className="flex items-center gap-4 border-b-2 border-midnight-ink pb-6">
        <div className="w-16 h-16 bg-saffron-yellow border-2 border-midnight-ink rounded-full flex items-center justify-center">
          <User size={32} className="text-midnight-ink" />
        </div>
        <div>
          <h1 className="text-3xl font-display font-black text-midnight-ink">{user.name}</h1>
          <p className="text-sm font-bold uppercase tracking-widest text-signal-blue">{user.role}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {instructorProfile && (
          <section className="space-y-4 bg-white border-2 border-midnight-ink p-6 md:col-span-2 max-w-2xl">
            <div className="flex justify-between items-start">
              <SectionHeading>Instructor Profile</SectionHeading>
              {!isEditingInstructor && (
                <button 
                  onClick={() => setIsEditingInstructor(true)}
                  className="text-xs font-bold text-signal-blue hover:underline uppercase tracking-wider"
                >
                  Edit
                </button>
              )}
            </div>

            <div className="mb-4">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Verification Status</label>
              <div className="flex items-center gap-2 mt-1">
                {instructorProfile.verificationStatus === 'VERIFIED' && <CheckCircle size={16} className="text-green-600" />}
                {instructorProfile.verificationStatus === 'PENDING' && <Shield size={16} className="text-warning-yellow" />}
                {instructorProfile.verificationStatus === 'REJECTED' && <Shield size={16} className="text-ember-red" />}
                {instructorProfile.verificationStatus === 'UNVERIFIED' && <Shield size={16} className="text-gray-400" />}
                <span className="font-bold">{instructorProfile.verificationStatus}</span>
              </div>
              
              {(instructorProfile.verificationStatus === 'UNVERIFIED' || instructorProfile.verificationStatus === 'REJECTED') && (
                <button 
                  onClick={() => requestVerification.mutate()}
                  disabled={requestVerification.isPending}
                  className="mt-2 text-xs font-bold text-signal-blue hover:underline"
                >
                  {requestVerification.isPending ? 'Requesting...' : 'Request Verification'}
                </button>
              )}
            </div>

            {isEditingInstructor ? (
              <div className="space-y-4 pt-4 border-t border-midnight-ink/20">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Bio</label>
                  <textarea 
                    value={bio} 
                    onChange={e => setBio(e.target.value)}
                    className="w-full border-2 border-midnight-ink p-2 font-usual focus:ring-2 focus:ring-signal-blue focus:outline-none"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Expertise</label>
                  <input 
                    type="text"
                    value={expertise} 
                    onChange={e => setExpertise(e.target.value)}
                    placeholder="e.g. Mathematics, Programming"
                    className="w-full border-2 border-midnight-ink p-2 font-usual focus:ring-2 focus:ring-signal-blue focus:outline-none"
                  />
                </div>
                <div className="flex gap-3">
                  <PillButton onClick={handleInstructorSave} disabled={updateInstructorProfile.isPending}>
                    {updateInstructorProfile.isPending ? 'Saving...' : 'Save Profile'}
                  </PillButton>
                  <button 
                    onClick={() => {
                      setIsEditingInstructor(false);
                      setBio(instructorProfile.bio || '');
                      setExpertise(instructorProfile.expertise || '');
                    }}
                    className="font-bold text-sm text-gray-600 hover:underline"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 pt-4 border-t border-midnight-ink/20">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Bio</label>
                  <BodyText className="text-sm mt-1">{instructorProfile.bio || 'No bio provided.'}</BodyText>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Expertise</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Briefcase size={16} className="text-midnight-ink/60" />
                    <span className="font-bold text-sm">{instructorProfile.expertise || 'None specified'}</span>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
