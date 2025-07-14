<div className="hidden md:flex items-center space-x-4">
             {isAuthenticated ? (
               <>
                {user?.role === 'admin' && (
                  <Link to="/admin">
                    <Button variant="outline" size="sm">
                      Admin Panel
                    </Button>
                  </Link>
                )}
                <span className="text-sm text-gray-600">{user?.points} points</span>
               </>
             )}
           </div>